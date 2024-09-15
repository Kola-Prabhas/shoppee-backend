const { Cart } = require('../models/Cart.js');



exports.addToCart = async function (req, res) {
	const { id } = req.user;

	try {
		const cartItem = new Cart({ ...req.body, user: id });
		const doc = await cartItem.save();
		const item = await Cart.findById(doc._id).populate('product').populate('user');

		res.status(200).json(item);
	} catch (err) {
		res.status(400).json(err)
	}
};


exports.fetchItemsByUserId = async function (req, res) {
	const { id } = req.user;

	try {
		const cart = await Cart.find({user: id}).populate('product').populate('user');

		res.status(200).json(cart);
	} catch (err) {
		res.status(400).json(err)
	}
};


exports.updateCart = async function (req, res) {
	const { id } = req.params;

	try {
		const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true }).populate('product').populate('user');

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