const { Cart } = require('../models/Cart.js');



exports.addToCart = async function (req, res) {
	const { id } = req.user;

	try {
		const cartItem = new Cart({ ...req.body, user: id });
		const doc = await cartItem.save();
		const item = await Cart.findById(doc._id).populate('product').populate('user');

		res.status(200).json({
			success: true,
			message: `${item.product.title} added to cart successfully`,
			data: {item},
			error: null
		});


	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			data: null,
			error: err
		})
	}
};


exports.fetchCartItemsByUserId = async function (req, res) {
	const { id } = req.user;

	try {
		const cart = await Cart.find({user: id}).populate('product').populate('user');

		res.status(200).json({
			success: true,
			message: 'Cart items fetched successfully',
			data: {cart},
			error: null
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			data: null,
			error: err
		})
	}
};


exports.updateCartItem = async function (req, res) {
	const { id } = req.params;

	try {
		const cartItem = await Cart.findByIdAndUpdate(
			id,
			req.body,
			{ new: true }
		).populate('product').populate('user');

		if (!cartItem) {
			return res.status(404).json({
				success: false,
				message: 'Unable to update item which is not added in cart',
				data: null,
				error: {
					message: `cart item with id ${id} not found`
				}
			});
		}

		res.status(200).json({
			success: true,
			message: 'cart item updated successfully',
			data: { item: cartItem },
			error: null
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			data: null,
			error: err
		})
	}
};


exports.deleteCartItem = async function (req, res) {
	const { id } = req.params;

	try {
		const cartItem = await Cart.findById(id).populate('product', 'id title');

		if (!cartItem) {
			return res.status(404).json({
				success: false,
				message: 'Unable to delete item which is not added in cart',
				data: null,
				error: {
					message: `cart item with id ${id} not found`
				}
			});
		}

		await Cart.findByIdAndDelete(id);
		res.status(200).json({
			success: true,
			message: 'Cart item deleted successfully',
			data: { item: cartItem },
			error: null
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			data: null,
			error
		})
	}
};


exports.clearCart = async function (req, res) {
	const { cartItemIds } = req.body;

	try {
		for (const id of cartItemIds) {
			await Cart.findByIdAndDelete(id);
		}

		res.status(200).json({
			success: true,
			message: 'Cart Cleared Successfully',
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
}