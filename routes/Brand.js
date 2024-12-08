const express = require('express');

const { fetchBrands, addBrand } = require('../controller/Brand.js');


const router = express.Router();


router.get('/', fetchBrands)
	.post('/', addBrand);

	



exports.router = router;