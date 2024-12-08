const { Brand } = require('../models/Brand.js');



exports.fetchBrands = async function (req, res) {
	try {
		const brands = await Brand.find({});
		res.status(200).json(brands);
	} catch (err) {
		res.status(400).json(err)
	}
};


exports.addBrand = async function (req, res) {
	const { label, value } = req.body;
	const { role } = req.user;


	try {
		if (role !== 'admin') {
			throw new Error('Only admin can add new Brands');
		}

		if (!label) {
			throw new Error(`Invalid label. Brand label ${label} is invalid`);
		}

		if (!value) {
			throw new Error(`Invalid value. Brand value ${value} is invalid`);
		}

		const brand = new Brand({ label, value });
		await brand.save();

		res.status(200).json({
			success: true,
			message: 'Brand added successfully',
			data: { brand },
			error: null,
		});
	} catch (e) {
		res.status(400).json({
			success: false,
			message: e.message,
			data: null,
			error: e,
		});
	}
}



