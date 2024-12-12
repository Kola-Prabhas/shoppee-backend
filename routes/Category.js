const { fetchCategories, addCategory } = require('../controller/Category.js');
const express = require('express');
const { isAuth } = require('../services/Common');


const router = express.Router();


router.get('/', fetchCategories)
	.post('/', isAuth(), addCategory);




exports.router = router;