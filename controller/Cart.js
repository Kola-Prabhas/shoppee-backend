const { Cart } = require('../models/Cart.js');



exports.addToCart = async function (req, res) {
	try {
		const { user, session } = req;
		const userId = user ? user.id : null;

		if (!userId) {
			session.cart = session.cart || [];
		}

		const cartItemData = { ...req.body, user: userId };
		const cartItem = new Cart(cartItemData);
		const savedItem = await cartItem.save();

		const populatedItem = await Cart.findById(savedItem._id)
			.populate('product')
			.populate(userId ? 'user' : '');

		if (!userId) {
			session.cart.push(populatedItem);
		}

		res.status(200).json({
			success: true,
			message: `${populatedItem.product.title} added to cart successfully`,
			data: { item: populatedItem },
			error: null,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			data: null,
			error: err,
		});
	}
};



exports.fetchCartItemsByUserId = async function (req, res) {
	const {
		user,
		session
	} = req;

	const id = user?.id;

	try {
		let cart;

		if (user) {
			cart = await Cart.find({ user: id })
				.populate('product')
				.populate('user');
		} else {
			cart = session.cart;

		}
		
		res.status(200).json({
			success: true,
			message: 'Cart items fetched successfully',
			data: { cart },
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
	const {
		user,
		session,
		body
	} = req;

	try {
		const cartItem = await Cart.findByIdAndUpdate(
			id,
			body,
			{ new: true }
		).populate('product').populate(user ? 'user' : '');

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

		const sessionItem = session.cart.find(item => item.id === cartItem.id);
		sessionItem.quantity = body.quantity;

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