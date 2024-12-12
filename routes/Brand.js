const express = require('express');

const { fetchBrands, addBrand } = require('../controller/Brand.js');
const { isAuth } = require('../services/Common');


const router = express.Router();


router.get('/', fetchBrands)
	.post('/', isAuth(), addBrand);

	



exports.router = router;