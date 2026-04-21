/**
 * Agent Routes
 */
const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.post('/start', agentController.handleStartGoal);
router.post('/approve', agentController.handleApproveAction);
router.post('/unified-sync', agentController.handleUnifiedSync);
router.post('/run-intelligence', agentController.handleRunIntelligence);
router.get('/status', agentController.handleGetStatus);

module.exports = router;
