/**
 * Stream Routes
 */
const express = require('express');
const router = express.Router();
const streamController = require('../controllers/streamController');
const { rateLimit } = require('../utils/rateLimiter');

router.post('/stream', (req, res, next) => {
  const userId = req.body.user_id || 'anonymous';
  if (!rateLimit(userId, 20, 60000)) { // 20 requests per minute
    return res.status(429).json({ error: 'Too many requests', message: 'Rate limit exceeded' });
  }
  next();
}, streamController.handleStream);

module.exports = router;

