/**
 * System Routes
 */
const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

router.post('/run', systemController.handleRun);

module.exports = router;
