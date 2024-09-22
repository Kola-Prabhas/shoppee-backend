const express = require('express');
const {
	createUser,
	loginUser,
	logoutUser,
	resetPasswordRequest,
	resetPassword
} = require('../controller/Auth.js');
const passport = require('passport');

const router = express.Router();


router.post('/signup', createUser)
	.post('/login', passport.authenticate('local'), loginUser)
	.post('/logout', logoutUser)
	.post('/reset-password-request', resetPasswordRequest)
	.post('/reset-password', resetPassword)
	// .get('/check', checkAuth)
      



exports.router = router;