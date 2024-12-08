const { fetchCategories, addCategory } = require('../controller/Category.js');
const express = require('express');


const router = express.Router();


router.get('/', fetchCategories)
	.post('/', addCategory);




exports.router = router;