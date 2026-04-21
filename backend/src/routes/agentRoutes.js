/**
 * Agent Routes
 */
const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.post('/start', agentController.handleStartGoal);
router.post('/approve', agentController.handleApproveAction);
router.get('/status', agentController.handleGetStatus);

module.exports = router;
