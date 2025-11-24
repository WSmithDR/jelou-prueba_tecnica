const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customers');

// Crear Cliente
router.post('/', customerController.createCustomer);

// Búsqueda y Listado (GET /customers?search=...)
router.get('/', customerController.getCustomers);

// Detalle (Público)
router.get('/:id', customerController.getCustomerById);

// Actualizar datos del cliente
router.put('/:id', customerController.updateCustomer);

// Eliminar cliente
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;