const crypto = require('crypto');
const { User } = require('../models/User.js');
const { sanitizeUser } = require('../services/Common.js');




exports.createUser = async function (req, res) {
	try {
		const salt = crypto.randomBytes(16);
		crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
			const user = new User({ ...req.body, password: hashedPassword, salt });
			const doc = await user.save();

			req.login(sanitizeUser(doc), err => {
				if (err) {
					res.status(400).json(err);
				} else {
					res.status(201).json(sanitizeUser(doc));
				}
			})
		})
	} catch (err) {
		res.status(400).json(err)
	}
};

exports.loginUser = async function (req, res) {
	res.json({ status: 'success' });
};

exports.checkUser = async function (req, res) {
	res.json(req.user);
};