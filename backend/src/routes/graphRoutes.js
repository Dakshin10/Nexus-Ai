/**
 * Graph Routes
 */
const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

router.post('/graph', graphController.handleGraph);

module.exports = router;
