const { fetchAllProducts, fetchProductById, updateProduct, createProduct, fetchProducts } = require('../controller/Product.js');
const express = require('express');


const router = express.Router();


router.post('/', createProduct)
	.get('/', fetchAllProducts)
	// .get('/pipeline', fetchProducts)
	.get('/:id', fetchProductById)
	.patch('/:id', updateProduct);



exports.router = router;