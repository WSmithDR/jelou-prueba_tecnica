const express = require('express');
const router = express.Router();
const { ordersController } = require('../controllers');

router.post('/', ordersController.createOrder);

module.exports = router;