const crypto = require('crypto');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js');
const { sanitizeUser } = require('../services/Common.js');

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
					}).status(201).json({id: doc.id, role: doc.role});
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

// exports.checkAuth = async function (req, res) {
// 	if (req.user) {
// 		res.json(req.user);
// 	} else {
// 		res.sendStatus(401);
// 	}
// };