const { Order } = require('../models/Order.js');
const { Product } = require('../models/Product.js');
const { Address } = require('../models/Address.js');
const { Cart } = require('../models/Cart.js');
const { sendMail, generateHtmlInvoice } = require('../services/Common.js');


exports.createOrder = async function (req, res) {
	const orderData = req.body;
	const cartId = orderData.items.id;
	const email = orderData.email;

	delete orderData.email;

	try {
		if (orderData?.totalItems === 0) {
			throw new Error('Cannot create an order with no items');
		}

		const order = new Order(orderData);
		const doc = await order.save();

		const cart = await Cart.findByIdAndDelete(cartId);

        // Decrease the stock of all items by quantity ordered
		for (const item of order.items) {
			const product = await Product.findById(item.product.id);

			product.stock -= item.quantity;

			await product.save();
		}

		const to = email;
		const subject = 'Order Placed Successfully from SwiftStore';
		const html = generateHtmlInvoice(order)

		sendMail({to, subject, html})

		res.status(200).json({
			success: true,
			message: 'Order created successfully',
			data: { order: doc },
			error: null,
		});
	} catch (err) {
		console.log('error ', err)
		res.status(400).json({
			success: false,
			message: err.message,
			data: null,
			error: err
		})
	}
};


exports.fetchOrdersByUserId = async function (req, res) {
	const { id } = req.user;

	try {
		const orders = await Order.find({ user: id }).populate('selectedAddress');
		
		res.status(200).json({
			success: true,
			message: 'Orders fetched successfully',
			data: {
				orders,
				totalOrders: orders.length
			},
			error: null
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
			data: null,
			error
		})
	}
};


exports.fetchAllOrders = async function (req, res) {
	const condition = {};

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
		const docs = await orders.populate('selectedAddress').exec();
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