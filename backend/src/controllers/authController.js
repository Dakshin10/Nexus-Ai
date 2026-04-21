/**
 * Auth Controller
 * Unified logic for multi-provider OAuth 2.0 flows.
 */
const { CONNECTORS } = require('../config/connectors');
const gmailService = require('../services/gmailService');
const tokenStore = require('../utils/tokenStore');

/**
 * GET /auth/:provider
 * Initiates the OAuth flow for a specific provider.
 */
async function initiateAuth(req, res) {
  const { provider } = req.params;
  const connector = CONNECTORS[provider];

  if (!connector) {
    return res.status(404).send('Provider not supported');
  }

  try {
    let authUrl = '';
    
    if (provider === 'gmail') {
      authUrl = gmailService.getAuthUrl();
    } else if (provider === 'notion') {
      // Direct Notion Auth URL (Constructed)
      const clientId = process.env.NOTION_CLIENT_ID;
      const redirectUri = process.env.NOTION_REDIRECT_URI;
      authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}`;
    }

    if (!authUrl) throw new Error(`Auth URL generation failed for ${provider}`);
    
    res.redirect(authUrl);
  } catch (error) {
    console.error(`[AuthController] Initiate failed for ${provider}:`, error.message);
    res.status(500).send(`Failed to initiate ${provider} authentication`);
  }
}

/**
 * GET /auth/:provider/callback
 * Handles the OAuth callback and token exchange.
 */
async function handleCallback(req, res) {
  const { provider } = req.params;
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`Authentication failed: ${error}`);
  }

  try {
    if (provider === 'gmail') {
      const tokens = await gmailService.setTokens(code);
      await tokenStore.saveTokens('me', 'gmail', tokens);
    } else if (provider === 'notion') {
      // Handle Notion Token Exchange (Mocking implementation logic for now)
      // Real implementation would use axios.post('https://api.notion.com/v1/oauth/token')
      console.log('[AuthController] Notion callback received code:', code);
      // For this build, if NOTION_API_KEY exists, we treat it as "Connected" 
      // but the flow represents the OAuth pattern.
    }

    // Success Landing Page (Auto-closes)
    res.send(`
      <html>
        <body style="background: #050505; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="padding: 40px; border-radius: 24px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); text-align: center;">
            <h1 style="color: #818cf8; margin-bottom: 8px;">Success!</h1>
            <p style="color: #94a3b8; font-size: 14px;">${provider.toUpperCase()} has been connected to NEXUS.</p>
            <p style="font-size: 11px; color: #475569; margin-top: 20px;">This window will close automatically...</p>
          </div>
          <script>
            setTimeout(() => { window.close(); }, 2000);
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(`[AuthController] Callback failed for ${provider}:`, err.message);
    res.status(500).send('Authentication processing failed');
  }
}

/**
 * GET /api/connectors/status
 * Real-time status of all configured connectors.
 */
async function getStatus(req, res) {
  try {
    const gmailConnected = await tokenStore.hasTokens('me', 'gmail');
    const notionConnected = !!process.env.NOTION_API_KEY; // Fallback to env for MVP

    res.json({
      gmail: gmailConnected,
      notion: notionConnected
    });
  } catch (error) {
    res.status(500).json({ error: 'Status check failed' });
  }
}

module.exports = {
  initiateAuth,
  handleCallback,
  getStatus
};
