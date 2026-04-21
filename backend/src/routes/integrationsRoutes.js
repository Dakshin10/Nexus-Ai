const express = require('express');
const router = express.Router();
const tokenStore = require('../utils/tokenStore');

/**
 * @route   GET /api/integrations/status
 * @desc    Get status of all external integrations
 */
router.get('/status', async (req, res) => {
  const { userId } = req.query;
  const targetUser = userId || 'me';

  try {
    // Check Gmail
    const gmailConnected = await tokenStore.hasTokens(targetUser, 'gmail');
    
    // Check Notion
    const notionConnected = await tokenStore.hasTokens(targetUser, 'notion');

    res.json({
      gmail: gmailConnected,
      notion: notionConnected
    });
  } catch (error) {
    console.error('[IntegrationsStatus] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch integration status' });
  }
});

module.exports = router;
