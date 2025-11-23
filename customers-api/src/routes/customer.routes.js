const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

// Definimos los endpoints
router.post('/', customerController.createCustomer);
router.get('/:id', customerController.getCustomerById);

module.exports = router;