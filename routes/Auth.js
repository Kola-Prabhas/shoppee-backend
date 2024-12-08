const express = require('express');
const {
	createUser,
	loginUser,
	logoutUser,
	resetPasswordRequest,
	resetPassword
} = require('../controller/Auth.js');

const router = express.Router();


router.post('/signup', createUser)
	.post('/login',	loginUser)
	.post('/logout', logoutUser)
	.post('/reset-password-request', resetPasswordRequest)
	.post('/reset-password', resetPassword)




exports.router = router;