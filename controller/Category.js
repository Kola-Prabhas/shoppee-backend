const { Category } = require('../models/Category.js');


exports.fetchCategories = async function (req, res) {
	try {
		const categories = await Category.find({});
		res.status(200).json(categories);
	} catch (err) {
		res.status(400).json(err)
	}
};

exports.addCategory = async function (req, res) {
	const { label, value } = req.body;
	const { role } = req.user;


	try {
		if (role !== 'admin') {
			throw new Error('Only admin can add new Categories');
		}
		
		if (!label) {
			throw new Error(`Invalid label. Category label ${label} is invalid`);
		}

		if (!value) {
			throw new Error(`Invalid value. Category value ${value} is invalid`);
		}

		const category = new Category({ label, value });
		await category.save();

		res.status(200).json({
			success: true,
			message: 'Category added successfully',
			data: { category },
			error: null,
		});
	} catch (e) {
		res.status(400).json({
			success: false,
			message: e.error,
			data: null,
			error: e,
		});
	}
}