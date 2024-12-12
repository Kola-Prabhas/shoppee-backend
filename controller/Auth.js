const crypto = require('crypto');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js');
const { sanitizeUser, sendMail } = require('../services/Common.js');
const passport = require('passport');


const SECRET = 'SECRET';


exports.createUser = async function (req, res) {
	const { email, password } = req.body;

	try {
		const salt = crypto.randomBytes(16);
		crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
			try {
				const result = await User.findOne({ email });

				if (result) {
					throw new Error('User already exists try different email');
				}

				const user = new User({ ...req.body, password: hashedPassword, salt });
				const doc = await user.save();

				const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET);

				req.login(sanitizeUser(doc), err => {
					if (err) {
						res.status(400).json(err);
					} else {
						// const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET);
						res.cookie('jwt', token, {
							expires: new Date(Date.now() + 3600000),
							httpOnly: true, // Cookie can't be accessed by JavaScript
							secure: true, // Ensure this is true if you're using HTTPS
							sameSite: 'None', // Enable cross-origin cookies
						}).status(201).json({
							success: true,
							message: 'User account created successfully',
							data: {
								user: { id: doc.id, role: doc.role },
								redirect: '/'
							},
							error: null
						});
					}
				})
			} catch (err) {
				res.status(400).json({
					success: false,
					message: err.message,
					data: null,
					error: err
				})
			}
		})
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			data: null,
			error: err
		})
	}
};

exports.loginUser = async function (req, res, next) {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.status(401).json(info);
		}

		res.cookie('jwt', user.token, {
			expires: new Date(Date.now() + 3600000),
			httpOnly: true, // Cookie can't be accessed by JavaScript
			secure: true, // Ensure this is true if you're using HTTPS
			sameSite: 'None', // Enable cross-origin cookies
		}).status(201).json({
			success: true,
			message: 'User login successful',
			data: { user, redirect: '/' },
			error: null
		});
	})(req, res, next);
};

exports.logoutUser = async function (req, res) {
	res.cookie('jwt', null, {
		expires: new Date(Date.now()),
		httpOnly: true, // Cookie can't be accessed by JavaScript
		secure: true, // Ensure this is true if you're using HTTPS
		sameSite: 'None', // Enable cross-origin cookies
	}).status(201).json({ success: true, message: 'User loggedOut successfully' });
};

exports.resetPasswordRequest = async function (req, res) {
	const { email } = req.body;


	try {
		const user = await User.findOne({ email });

		if (!user) {
			throw new Error("Account not found with the given email");
		}

		const token = crypto.randomBytes(64).toString('hex');

		user.resetPasswordToken = token;
		await user.save();

		const resetPasswordPage = '/reset-password?email=' + email + '&token=' + token;
		const subject = 'SwiftStore Reset Password Link';
		const html = `<p>Click <a href=${resetPasswordPage}>here</a> to reset your password for SwiftStore Account`

		await sendMail({ to: email, subject, html });

		res.status(200).json({
			success: true,
			message: 'We have sent an email with link to reset your password',
			data: null,
			error: null
		});
	} catch (e) {
		res.status(400).json({
			success: false,
			message: e.message,
			data: null,
			error: e
		});
	}
};


exports.resetPassword = async function (req, res) {
	const { email, password, token } = req.body;

	console.log('email ', email);

	try {
		const user = await User.findOne({ email });

		if (!user) {
			console.log('user ', user);

			throw new Error("Account not found with the given email");
		}

		if (user.resetPasswordToken !== token) {
			throw new Error("Reset password link expired or broken");
		}

		const salt = crypto.randomBytes(16);
		crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {

			user.password = hashedPassword;
			user.salt = salt;
			user.resetPasswordToken = '';

			await user.save();

			const subject = 'SwiftStore Reset Password Successful';
			const html = `<p>You have successfully reset password for your SwiftStore Account</p>`

			await sendMail({ to: email, subject, html });

			res.status(200).json({
				success: true,
				message: 'Password Reset Successfully',
				data: null,
				error: null
			});
		})
	} catch (e) {
		res.status(400).json({
			success: false,
			message: e.message,
			data: null,
			error: e
		})
	}
};