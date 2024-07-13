const { fetchCategories } = require('../controller/Category.js');
const express = require('express');


const router = express.Router();


router.get('/', fetchCategories)




exports.router = router;