const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Public Auth Routes (OAuth Flow)
 */
router.get('/auth/:provider', authController.initiateAuth);
router.get('/auth/:provider/callback', authController.handleCallback);

/**
 * API Routes (Status & Sync)
 */
router.get('/api/connectors/status', authController.getStatus);

module.exports = router;
