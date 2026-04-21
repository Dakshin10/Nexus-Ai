/**
 * Proactive Routes
 */
const express = require('express');
const router = express.Router();
const proactiveService = require('../proactiveService');

router.get('/latest', (req, res) => {
  const alert = proactiveService.getLatestAlert();
  res.json(alert || {});
});

module.exports = router;
