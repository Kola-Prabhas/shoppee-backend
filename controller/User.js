const { User } = require('../models/User.js');



exports.fetchUserById = async function (req, res) {
	const { id } = req.user;

	try {
		const user = await User.findById(id, 'name email role id addresses');

		res.status(200).json(user);
	} catch (err) {
		res.status(400).json(err)
	}
};


exports.updateUser = async function (req, res) {
	const { id } = req.params;

	const data = req.body;

	try {
		const user = await User.findByIdAndUpdate(id, data, {new: true});

		res.status(200).json(user);
	} catch (err) {
		res.status(400).json(err)
	}
};