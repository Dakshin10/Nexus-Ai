/**
 * Onboarding Routes
 */
const express = require('express');
const router = express.Router();
const onboardingPipeline = require('../engines/onboarding/onboardingPipeline');

router.post('/init', async (req, res) => {
  const { userId, context } = req.body;
  try {
    const result = await onboardingPipeline.process(userId || 'anonymous', context || {});
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
