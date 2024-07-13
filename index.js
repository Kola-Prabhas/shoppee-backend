const express = require('express');
const server = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

const productsRouter = require('./routes/Product');
const brandsRouter = require('./routes/Brand');
const categoriesRouter = require('./routes/Category');
const usersRouter = require('./routes/User');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const ordersRouter = require('./routes/Order');



const cors = require('cors');
const { User } = require('./models/User');
const { isAuth, sanitizeUser } = require('./services/Common');
const PORT = 8000;


// middlewares

server.use(express.json());
server.use(session({
	secret: 'Keyboard cat',
	resave: false,
	saveUninitialized: false,
}));
server.use(passport.authenticate('session'));
server.use(cors({
	exposedHeaders: ['X-Total-Count']
}))


server.use('/products', isAuth, productsRouter.router);
server.use('/brands', brandsRouter.router);
server.use('/categories', categoriesRouter.router);
server.use('/users', usersRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', cartRouter.router);
server.use('/orders', ordersRouter.router);


// passport strategies

passport.use(new LocalStrategy(
	async function (username, password, done) {
		try {
			const user = await User.findOne({ email: username});

			if (!user) {
				return done(null, false, { message: 'Invalid credentials' })
			}
			
			crypto.pbkdf2(req.body.password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
				if(!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
					return done(null, false, { message: 'Invalid credentials' })
				} 
				
				done(null, user);
			})
		} catch (err) {
			done(err);
		}
	}
));

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


main();


async function main() {
	try {
		mongoose.connect(
			'mongodb+srv://kolaprabhas2310:nhmkd5Sd45vtDHWx@cluster0.2lqdhp0.mongodb.net/'
		);

		console.log("Connected to database successfully!");
	} catch (e) {
		console.log("An error occurred while connecting to database");
	}
}

server.get('/', (req, res) => {
	res.json({ status: 'success' });

})



server.listen(PORT, () => {
	console.log('server started at port ', PORT);
})




