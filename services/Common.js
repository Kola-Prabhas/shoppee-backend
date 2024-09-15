const passport = require("passport")

exports.sanitizeUser = function (user) {
	return {id: user.id, role: user.role}
}


exports.isAuth = function (req, res, done) {
	return passport.authenticate('jwt', {session: false})
}


exports.cookieExtractor = function (req) {
	let token = null;

	if (req && req.cookies) {
		token = req.cookies['jwt'];
	}

	return token;
}