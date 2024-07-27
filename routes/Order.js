const { createOrder, updateOrder, deleteOrder, fetchOrdersByUserId, fetchAllOrders } = require('../controller/Order.js');
const express = require('express');


const router = express.Router();


router.get('/', fetchAllOrders)
	.get('/own', fetchOrdersByUserId)
	.post('/', createOrder)
	.patch('/:id', updateOrder)
	.delete('/:id', deleteOrder)




exports.router = router;