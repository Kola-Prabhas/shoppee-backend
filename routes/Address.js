const express = require('express');

const {
	fetchUserAddress,
	addUserAddress,
	updateUserAddress,
	deleteUserAddress
} = require('../controller/Address');


const router = express.Router();

router.get('/', fetchUserAddress)
	.post('/', addUserAddress)
	.delete('/:id', deleteUserAddress)
	.put('/:id', updateUserAddress);


exports.router = router;
