const express = require('express');
const router = express.Router();
const { ordersController } = require('../controllers');
const {checkIdempotency} = require('../middlewares');

// Crear pedido
router.post('/', ordersController.createOrder);

// Obtener pedido
router.get('/:id', ordersController.getOrderById);

// Confirmar pedido
router.post('/:id/confirm',checkIdempotency, ordersController.confirmOrder);

// Cancelar pedido
router.post('/:id/cancel', ordersController.cancelOrder);

module.exports = router;