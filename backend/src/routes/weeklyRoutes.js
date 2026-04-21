/**
 * Weekly Routes
 */
const express = require('express');
const router = express.Router();
const weeklyController = require('../controllers/weeklyController');

router.post('/', weeklyController.handleWeeklyReport);

module.exports = router;
