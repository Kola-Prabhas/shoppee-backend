const { User } = require('../models/User.js');



exports.fetchUserById = async function (req, res) {
	const { id } = req.user;

	try {
		const user = await User.findById(id, 'email role id addresses orders');

		res.status(200).json(user);
	} catch (err) {
		res.status(400).json(err)
	}
};


exports.updateUser = async function (req, res) {
	const { id } = req.params;

	try {
		const user = await User.findByIdAndUpdate(id, req.body, { new: true});

		res.status(200).json(user);
	} catch (err) {
		res.status(400).json(err)
	}
};