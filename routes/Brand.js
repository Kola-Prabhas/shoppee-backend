const express = require('express');

const { fetchBrands } = require('../controller/Brand.js');


const router = express.Router();


router.get('/', fetchBrands)
	



exports.router = router;