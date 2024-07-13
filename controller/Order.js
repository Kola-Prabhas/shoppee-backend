const { Order } = require('../models/Order.js');




exports.createOrder = async function (req, res) {
	try {
		const order = new Order(req.body);
		const doc = await order.save();

		res.status(200).json(doc);
	} catch (err) {
		res.status(400).json(err)
	}
};


exports.fetchOrdersByUserId = async function (req, res) {
	const { userId } = req.params;

	try {
		const orders = await Order.find({user: userId});


		res.status(200).json(orders);
	} catch (err) {
		res.status(400).json(err)
	}
};

exports.fetchAllOrders = async function (req, res) {
	const condition = {};

	console.log('req.query ', req.query);


	if (!req.query.admin) {
		condition.deleted = {$ne: true};
	}

	let orders = Order.find(condition);
	let ordersCount = Order.find(condition);

	

	if (req.query._sort) {
		orders = orders.sort({ [req.query._sort]: req.query._order })
	}

	if (req.query._page) {
		const pageSize = req.query._per_page;
		const page = req.query._page;

		orders = orders.skip((page - 1) * pageSize).limit(pageSize);
	}


	try {
		const docs = await orders.exec();

		const totalOrders = await ordersCount.count().exec();

		res.set('X-Total-Count', totalOrders);
		res.status(201).json(docs);
	} catch (err) {
		res.status(400).json(err);
	}
};


exports.updateOrder = async function (req, res) {
	const { id } = req.params;

	try {
		const order = await Order.findByIdAndUpdate(id, req.body, { new: true }).populate('user');

		console.log(order);

		res.status(200).json(order);
	} catch (err) {
		res.status(400).json(err)
	}
};

exports.deleteOrder = async function (req, res) {
	const { id } = req.params;

	try {
		const order = await Order.findByIdAndDelete(id);

		res.status(200).json(order);
	} catch (err) {
		res.status(400).json(err)
	}
};