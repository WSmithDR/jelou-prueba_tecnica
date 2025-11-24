const express = require('express');
const router = express.Router();
const { productsController } = require('../controllers');

router.post('/', productsController.createProduct);

//Busqueda por ?search=
router.get('/', productsController.getProduct);

// Busqueda por id
router.get('/:id', productsController.getProduct);

//Actualizacion
router.patch('/:id', productsController.updateProduct);

module.exports = router;