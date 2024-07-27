const { fetchUserById, updateUser } = require('../controller/User.js');
const express = require('express');


const router = express.Router();


router.get('/own', fetchUserById)
	.patch('/:id', updateUser)



exports.router = router;