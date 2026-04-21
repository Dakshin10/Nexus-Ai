/**
 * Orchestrator Routes
 */
const express = require('express');
const router = express.Router();
const orchestratorController = require('../controllers/orchestratorController');

router.post('/', orchestratorController.handleOrchestrate);
router.post('/unified-sync', orchestratorController.handleUnifiedSync);

module.exports = router;
