exports.sanitizeUser = function (user) {
	return {id: user.id, role: user.role}
}


exports.isAuth = function (req, res, done) {
	if (req.user) {
		done();
	} else {
		res.status(401).json({ "message": "You need to login to use this feature" })
	}
}