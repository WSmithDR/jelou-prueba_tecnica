const express = require('express');
const router = express.Router();
const { getHealthCheck } = require('../controllers');

router.get('/', getHealthCheck);

module.exports = router;