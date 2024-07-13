const { Cart } = require('../models/Cart.js');




exports.addToCart = async function (req, res) {
	try {
		const cart = new Cart(req.body);
		const doc = await cart.save();

		res.status(200).json(doc);
	} catch (err) {
		res.status(400).json(err)
	}
};





exports.fetchItemsByUserId = async function (req, res) {
	const { user } = req.query;

	try {
		const cart = await Cart.find({user}).populate('product').populate('user');


		res.status(200).json(cart);
	} catch (err) {
		res.status(400).json(err)
	}
};


exports.updateCart = async function (req, res) {
	const { id } = req.params;

	try {
		const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true }).populate('product').populate('user');

		console.log(cart);

		res.status(200).json(cart);
	} catch (err) {
		res.status(400).json(err)
	}
};

exports.deleteCart = async function (req, res) {
	const { id } = req.params;

	try {
		const cart = await Cart.findByIdAndDelete(id);

		res.status(200).json(cart);
	} catch (err) {
		res.status(400).json(err)
	}
};