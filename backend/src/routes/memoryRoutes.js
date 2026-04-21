/**
 * Memory Routes
 */
const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');

router.post('/', memoryController.handleMemoryUpdate);

module.exports = router;
