const {
	fetchAllProducts,
	fetchProductById,
	updateProduct,
	createProduct,
} = require('../controller/Product.js');
const { isAuth } = require('../services/Common');

const express = require('express');


const router = express.Router();


router.post('/', isAuth(), createProduct)
	.get('/', fetchAllProducts)
	.get('/:id', fetchProductById)
	.patch('/:id', isAuth(), updateProduct);



exports.router = router;