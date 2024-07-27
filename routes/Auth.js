const express = require('express');
const { createUser, loginUser} = require('../controller/Auth.js');
const passport = require('passport');


const router = express.Router();


router.post('/signup', createUser)
	.post('/login', passport.authenticate('local'), loginUser)
	// .get('/check', checkAuth)
      



exports.router = router;