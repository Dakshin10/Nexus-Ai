/**
 * Decision Routes
 */
const express = require('express');
const router = express.Router();
const decisionController = require('../controllers/decisionController');

router.post('/decision', decisionController.handleDecision);

module.exports = router;
