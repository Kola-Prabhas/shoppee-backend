const { fetchBrands } = require('../controller/Brand.js');
const express = require('express');


const router = express.Router();


router.get('/', fetchBrands)
	



exports.router = router;