const { Product } = require('../models/Product.js');

exports.createProduct = async function (req, res) {
	const product = new Product(req.body)

	try {
		const doc = await product.save();

		res.status(201).json(doc);
	} catch (err) {
		res.status(400).json(err);
	}
};


exports.fetchAllProducts = async function (req, res) {
	const condition = {};

	if (!req.query.admin) {
		condition.deleted = { $ne: true };
	}
	
	let products = Product.find(condition);
	let productsCount = Product.find(condition);

	if (req.query.category) {
		products = products.find({ category: req.query.category });
		productsCount =  productsCount.find({ category: req.query.category });
	}

	if (req.query.brand) {
		products = products.find({ brand: req.query.brand });
		productsCount =  productsCount.find({ brand: req.query.brand });
	}

	if (req.query._sort) {
		if (req.query._sort.includes('-')) {
			const sortField = req.query._sort.slice(1);
			products =  products.sort({ [sortField]: 'desc' })
		} else {
			const sortField = req.query._sort;
			products =  products.sort({ [sortField]: 'asc' })
		}
	}

	if (req.query._page) {
		const pageSize = req.query._per_page;
		const page = req.query._page;

		products =  products.skip((page - 1) * pageSize).limit(pageSize);
	}


	try {
		const docs = await products.exec();
		const totalProducts = await productsCount.count().exec(); 



		res.set('X-Total-Count', totalProducts);
		res.status(201).json(docs);
	} catch (err) {
		res.status(400).json(err);
	}
};


exports.fetchProductById = async function (req, res) {
	const { id } = req.params;


	try {
		const product = await Product.findById(id);
		res.status(200).json(product);
	} catch (err) {
		res.status(400).json(err);
	}
}

exports.updateProduct = async function (req, res) {
	const { id } = req.params;

	try {
		const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
		res.status(200).json(product);
	} catch (err) {
		console.log(err)
		res.status(400).json(err);
	}
}
