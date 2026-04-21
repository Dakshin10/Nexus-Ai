/**
 * UI Routes
 */
const express = require('express');
const router = express.Router();
const uiController = require('../controllers/uiController');

router.post('/process', uiController.handleUIProcess);

module.exports = router;
