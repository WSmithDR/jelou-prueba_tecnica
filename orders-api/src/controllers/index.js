const getHealthCheck = require('./health.controller');
const ordersController = require('./orders');
const productsController = require('./products');

module.exports = {
    getHealthCheck,
    ordersController,
    productsController
}