const express = require('express');
const router = express.Router();
const { getHealthCheck } = require('../controllers/health.controller');

router.get('/', getHealthCheck);

module.exports = router;