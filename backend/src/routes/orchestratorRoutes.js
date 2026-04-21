/**
 * Orchestrator Routes
 */
const express = require('express');
const router = express.Router();
const orchestratorController = require('../controllers/orchestratorController');

router.post('/', orchestratorController.handleOrchestrate);

module.exports = router;
