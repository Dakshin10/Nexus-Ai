const express = require('express');
const router = express.Router();
const tokenStore = require('../utils/tokenStore');

/**
 * @route   GET /api/integrations/status
 * @desc    Get status of all external integrations
 */
router.get('/status', async (req, res) => {
  try {
    // Check Gmail (stored as 'me' in this demo)
    const gmailConnected = await tokenStore.hasTokens('me');
    
    // Check Notion
    const notionConnected = !!process.env.NOTION_API_KEY;

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
