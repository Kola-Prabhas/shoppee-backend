const { Category } = require('../models/Category.js');




exports.fetchCategories = async function (req, res) {
	try {
		const categories = await Category.find({});
		res.status(200).json(categories);
	} catch (err) {
		res.status(400).json(err)
	}
};