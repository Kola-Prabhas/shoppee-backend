const {
	addToCart,
	fetchCartItemsByUserId,
	updateCartItem,
	deleteCartItem,
	clearCart
} = require('../controller/Cart.js');
const express = require('express');
const router = express.Router();


router.get('/', fetchCartItemsByUserId)
	.post('/', addToCart)
	.patch('/:id', updateCartItem)
	.delete('/:id', deleteCartItem)
	.delete ('/', clearCart);



exports.router = router;