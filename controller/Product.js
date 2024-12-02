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
	const page = +req.query._page || 1;
	const pageSize = +req.query._per_page || 10;

	const pipeline = [];
	const countPipeline = [];

	if (!req.query.admin) {
		pipeline.push({
			$match: { deleted: { $ne: true } }
		});

		countPipeline.push({
			$match: { deleted: { $ne: true } }
		});
	}

	if (req.query.category) {
		const categoriesArray = Array.isArray(req.query.category) ? req.query.category : [req.query.category];
		pipeline.push({
			$match: { category: {$in: categoriesArray} }
		});

		countPipeline.push({
			$match: { category: {$in: categoriesArray} }
		});
	}


	if (req.query.brand) {
		const brandsArray = Array.isArray(req.query.brand) ? req.query.brand : [req.query.brand];

		pipeline.push({
			$match: { brand: { $in: brandsArray } }
		})

		countPipeline.push({
			$match: { brand: { $in: brandsArray } }
		})
	}

	countPipeline.push({
		$count: 'totalItems'
	});

	pipeline.push({
		$addFields: {
			discountPrice: {
				$multiply: [
					"$price",
					{ $subtract: [1, { $multiply: ["$discountPercentage", 0.01] }] }
				]
			}
		}
	})

	if (req.query._sort) {
		const sortField = req.query._sort === 'price' ? 'discountPrice' : req.query._sort;
		const sortOrder = req.query._order === 'asc' ? 1 : -1;

		pipeline.push({
			$sort: {
				[sortField]: sortOrder
			}
		})
	}



	// Pagination 
	pipeline.push(
		{
			$skip: (page - 1) * pageSize
		},
		{
			$limit: pageSize
		}
	);

	pipeline.push(
		{
			$addFields: {
				id: { $toString: "$_id" } // Add 'id' field as a string version of '_id'
			}
		},
		{
			$project: {
				_id: 0  // Exclude '_id' if you don't want it
			}
		}
	);


	try {
		const result = await Product.aggregate(pipeline);
		const countResult = await Product.aggregate(countPipeline);
		const totalItems = countResult[0]?.totalItems ?? 0; // when no products found for given filters, countResult is undefined

		res.set('X-Total-Count', totalItems);
		res.status(200).json(result);
	} catch (e) {
		console.log('error ', e);
		res.status(400).json(e);
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
