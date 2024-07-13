const { addToCart, fetchItemsByUserId, updateCart, deleteCart } = require('../controller/Cart.js');
const express = require('express');


const router = express.Router();


router.get('/', fetchItemsByUserId)
	.post('/', addToCart)
	.patch('/:id', updateCart)
	.delete('/:id', deleteCart);




exports.router = router;