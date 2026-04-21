/**
 * Evaluation Routes
 */
const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');

router.post('/', evaluationController.handleEvaluate);
router.get('/stats', evaluationController.handleGetStats);

module.exports = router;
