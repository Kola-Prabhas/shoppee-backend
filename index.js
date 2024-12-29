require('dotenv').config();
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const path = require('path');



const productsRouter = require('./routes/Product');
const brandsRouter = require('./routes/Brand');
const categoriesRouter = require('./routes/Category');
const usersRouter = require('./routes/User');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const ordersRouter = require('./routes/Order');
const addressesRouter = require('./routes/Address');



const { User } = require('./models/User');
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/Common');


// Stripe Webhook
const endpointSecret = process.env.ENDPOINT_SECRET;

server.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
	let event = request.body;
	// Only verify the event if you have an endpoint secret defined.
	// Otherwise use the basic event deserialized with JSON.parse
	if (endpointSecret) {
		// Get the signature sent by Stripe
		const signature = request.headers['stripe-signature'];
		try {
			event = stripe.webhooks.constructEvent(
				request.body,
				signature,
				endpointSecret
			);
		} catch (err) {
			console.log(`⚠️  Webhook signature verification failed.`, err.message);
			return response.sendStatus(400);
		}
	}

	// Handle the event
	switch (event.type) {
		case 'payment_intent.succeeded':
			const paymentIntent = event.data.object;
			console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
			console.log({ paymentIntent });
			// Then define and call a method to handle the successful payment intent.
			// handlePaymentIntentSucceeded(paymentIntent);
			break;
		case 'payment_method.attached':
			const paymentMethod = event.data.object;
			// Then define and call a method to handle the successful attachment of a PaymentMethod.
			// handlePaymentMethodAttached(paymentMethod);
			break;
		default:
			// Unexpected event type
			console.log(`Unhandled event type ${event.type}.`);
	}

	// Return a 200 response to acknowledge receipt of the event
	response.send();
});


// middlewares


// server.use(express.raw({ type: 'application/json' }))
server.use(express.json());
server.use(express.static(path.resolve(__dirname, 'build')));
server.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
}));
server.use(cookieParser());
server.use(passport.initialize());
server.use(passport.session());
// server.use(passport.authenticate('session'));
server.use(cors({
	exposedHeaders: ['X-Total-Count'],
	origin: process.env.FRONTEND_URL, // CRA address
	credentials: true, // Allow credentials (cookies) to be sent
}))

// routers
server.use('/api/products', productsRouter.router);
server.use('/api/brands', brandsRouter.router);
server.use('/api/categories', categoriesRouter.router);
server.use('/api/user', isAuth(), usersRouter.router);
server.use('/api/auth', authRouter.router);
server.use('/api/cart', isAuth(), cartRouter.router);
server.use('/api/orders', isAuth(), ordersRouter.router);
server.use('/api/address', isAuth(), addressesRouter.router);

server.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// passport strategies

passport.use('local', new LocalStrategy(
	{ usernameField: 'email' },
	async function (email, password, done) {
		try {
			const user = await User.findOne({ email });

			if (!user) {
				return done(null, false, {
					success: false,
					message: 'No account found with the given email!',
				})
			}

			crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
				if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
					return done(null, false, {
						success: false,
						message: 'Incorrect password!',
					})
				}

				const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET);


				done(null, {
					...sanitizeUser(user),
					token
				});

			})
		} catch (err) {
			done(err);
		}
	}
));

const SECRET = process.env.SECRET;

const opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET;



passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
	try {
		const user = await User.findById(jwt_payload.id);

		if (!user) {
			return done(null, false);
		}

		return done(null, sanitizeUser(user));

	} catch (e) {
		return done(e, false);
	}
}));


// this creates session variable req.user when called from the callback
passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, sanitizeUser(user));
	});
});


// this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});


// Payments

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET);



server.post("/api/create-payment-intent", async (req, res) => {
	const { totalAmount } = req.body;

	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		amount: Math.round(totalAmount * 100),
		currency: "usd",
		// In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
		automatic_payment_methods: {
			enabled: true,
		},
	});

	res.send({
		clientSecret: paymentIntent.client_secret,
	});
});

main();


async function main() {
	try {
		await mongoose.connect(process.env.MONGODB_URL);

		console.log("Connected to database successfully!");
	} catch (e) {
		console.log("An error occurred while connecting to database");
	}
}


server.listen(process.env.PORT, () => {
	console.log('server started at port ', process.env.PORT);
})