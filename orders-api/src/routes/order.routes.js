const express = require('express');
const router = express.Router();
const { ordersController } = require('../controllers');
const {checkIdempotency} = require('../middlewares');

router.post('/', ordersController.createOrder);
router.post('/:id/confirm',checkIdempotency, ordersController.confirmOrder);

module.exports = router;