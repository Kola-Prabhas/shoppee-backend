const { Brand } = require('../models/Brand.js');



exports.fetchBrands = async function (req, res) {
	try {
		const brands = await Brand.find({});
		res.status(200).json(brands);
	} catch (err) {
		res.status(400).json(err)
	}
};



