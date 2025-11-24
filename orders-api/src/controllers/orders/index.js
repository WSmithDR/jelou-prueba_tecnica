const createOrder = require('./createOrder');
const confirmOrder = require('./confirmOrder');
const getOrderById = require('./getOrderById');
const cancelOrder = require('./cancelOrder');
const getOrders = require('./getOrders');

module.exports = {
    createOrder,
    confirmOrder,
    getOrderById,
    cancelOrder,
    getOrders
}