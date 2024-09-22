const crypto = require('crypto');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js');
const { sanitizeUser, sendMail } = require('../services/Common.js');
const { access } = require('fs/promises');

const SECRET = 'SECRET';


exports.createUser = async function (req, res) {
	try {
		const salt = crypto.randomBytes(16);
		crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
			// Check whether an user with the email already exists
			const result = await User.findOne({ email: req.body.email });

			if (result) {
				res.
					status(400).
					json({
						success: false,
						message: "User already exists try different email"
					});

				return;
			}

			const user = new User({ ...req.body, password: hashedPassword, salt });
			const doc = await user.save();

			const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET);



			req.login(sanitizeUser(doc), err => {
				if (err) {
					res.status(400).json(err);
				} else {
					const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET);

					res.cookie('jwt', token, {
						expires: new Date(Date.now() + 3600000),
						httpOnly: true, // Cookie can't be accessed by JavaScript
						secure: true, // Ensure this is true if you're using HTTPS
						sameSite: 'None', // Enable cross-origin cookies
					}).status(201).json({ id: doc.id, role: doc.role });
				}
			})
		})
	} catch (err) {
		res.status(400).json(err)
	}
};

exports.loginUser = async function (req, res) {
	res.cookie('jwt', req.user.token, {
		expires: new Date(Date.now() + 3600000),
		httpOnly: true, // Cookie can't be accessed by JavaScript
		secure: true, // Ensure this is true if you're using HTTPS
		sameSite: 'None', // Enable cross-origin cookies
	}).status(201).json(req.user);
};

exports.logoutUser = async function (req, res) {
	res.cookie('jwt', null, {
		expires: new Date(Date.now()),
		httpOnly: true, // Cookie can't be accessed by JavaScript
		secure: true, // Ensure this is true if you're using HTTPS
		sameSite: 'None', // Enable cross-origin cookies
	}).status(201).json({success: true, message: 'User loggedOut successfully'});
};

// exports.checkAuth = async function (req, res) {
// 	if (req.user) {
// 		res.json(req.user);
// 	} else {
// 		res.sendStatus(401);
// 	}
// };


exports.resetPasswordRequest = async function (req, res) {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		const token = crypto.randomBytes(64).toString('hex');

		user.resetPasswordToken = token;

		await user.save();

		const resetPasswordPage = 'http://localhost:3000/reset-password?email=' + email + '&token=' + token;
		const subject = 'SwiftStore Reset Password Link';
		const html = `<p>Click <a href=${resetPasswordPage}>here</a> to reset your password for SwiftStore Account`

		await sendMail({ to: email, subject, html });

		res.json({
			success: true,
			message: 'Reset Password Request Successful. We have sent an email with link to reset your password'
		});
	} else {
		res.sendStatus(400);
	}
};


exports.resetPassword = async function (req, res) {
	const { email, password, token } = req.body;

	const user = await User.findOne({ email });

	if (user && user.resetPasswordToken === token) {
		const salt = crypto.randomBytes(16);
		crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {

			user.password = hashedPassword;
			user.salt = salt;
			user.resetPasswordToken = '';

			await user.save();

			const subject = 'SwiftStore Reset Password Successful';
			const html = `<p>You have successfully reset password for your SwiftStore Account</p>`

			await sendMail({ to: email, subject, html });

			res.json({success: true, message: 'Reset Password Successful'});
		})
	} else {
		console.log('This code executed')
		res.sendStatus(400);
	}
};