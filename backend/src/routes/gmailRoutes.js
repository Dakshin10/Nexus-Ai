const express = require('express');
const router = express.Router();
const gmailService = require('../services/gmailService');
const tokenStore = require('../utils/tokenStore');

/**
 * @route   GET /api/integrations/gmail/connect
 * @desc    Generate Google OAuth URL and redirect
 */
router.get('/connect', (req, res) => {
  try {
    const authUrl = gmailService.getAuthUrl();
    // In a real app, you might want to return the URL for the frontend to handle the redirect
    // or redirect directly if this is a simple flow.
    res.json({ url: authUrl });
  } catch (error) {
    console.error('[GmailRoutes] Connect Error:', error.message);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

/**
 * @route   GET /api/integrations/gmail/callback
 * @desc    Handle OAuth callback and store tokens
 */
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('[GmailRoutes] Auth Error:', error);
    return res.status(400).json({ error: `Authentication failed: ${error}` });
  }

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    const tokens = await gmailService.setTokens(code);
    
    // For now we use a default 'me' userId. In production, this would be req.user.id
    await tokenStore.saveTokens('me', tokens);

    // Redirect to frontend with status
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}?gmail=connected`);
  } catch (err) {
    console.error('[GmailRoutes] Callback Error:', err.message);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    if (err.message.includes('invalid_grant')) {
      return res.redirect(`${frontendUrl}?gmail=error&reason=invalid_grant`);
    }
    
    res.redirect(`${frontendUrl}?gmail=error&reason=internal`);
  }
});

module.exports = router;
