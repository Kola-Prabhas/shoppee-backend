const { fetchAllProducts, fetchProductById, updateProduct, createProduct } = require('../controller/Product.js');
const express = require('express');


const router = express.Router();


router.post('/', createProduct)
	.get('/', fetchAllProducts)
	.get('/:id', fetchProductById)
	.patch('/:id', updateProduct);



exports.router = router;