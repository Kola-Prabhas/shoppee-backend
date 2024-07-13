const { User } = require('../models/User.js');




// exports.createUser = async function (req, res) {
// 	try {
// 		const user = new User(req.body);
// 		const doc = await user.save();

// 		res.status(200).json({id: doc.id, email: doc.email, role: doc.role});
// 	} catch (err) {
// 		res.status(400).json(err)
// 	}
// };


/* exports.loginUser = async function (req, res) {
	const { email } = req.body;
    
	try {
		const user = await User.findOne({ email });

		if (!user) {
			res.status(400).json({ message: 'Invalid Email' });
		} else if (user.password === req.body.password) {
			res.status(200).json({id: user.id, email: user.email, role: user.role});
		} else {
			res.status(400).json({ message: 'Invalid password' });
		}		
	} catch (err) {
		res.status(400).json(err)
	}
}; */



exports.fetchUserById = async function (req, res) {
	const { id } = req.params;

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