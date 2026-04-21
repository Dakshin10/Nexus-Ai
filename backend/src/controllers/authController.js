/**
 * Auth Controller
 * Unified logic for multi-provider OAuth 2.0 flows.
 */
const axios = require('axios');
const { CONNECTORS } = require('../config/connectors');
const gmailService = require('../services/gmailService');
const tokenStore = require('../utils/tokenStore');

/**
 * GET /auth/:provider
 * Initiates the OAuth flow for a specific provider.
 */
async function initiateAuth(req, res) {
  const { provider } = req.params;
  const { userId } = req.query;
  const connector = CONNECTORS[provider];

  if (!userId) {
    return res.status(400).send('userId is required to initiate authentication');
  }

  if (!connector) {
    return res.status(404).send('Provider not supported');
  }

  try {
    let authUrl = '';
    
    if (provider === 'gmail') {
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify",
        access_type: "offline",
        prompt: "consent",
        state: userId
      });
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    } else if (provider === 'notion') {
      const params = new URLSearchParams({
        client_id: process.env.NOTION_CLIENT_ID,
        response_type: "code",
        owner: "user",
        redirect_uri: process.env.NOTION_REDIRECT_URI,
        state: userId
      });
      authUrl = `https://api.notion.com/v1/oauth/authorize?${params}`;
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
  const { code, state, error } = req.query;
  const userId = state; // We stored userId in the state parameter

  if (error) {
    return res.status(400).send(`Authentication failed: ${error}`);
  }

  try {
    let finalTokens = {};

    if (provider === 'gmail') {
      finalTokens = await gmailService.setTokens(code);
      await tokenStore.saveTokens(userId || 'me', 'gmail', finalTokens);
    } else if (provider === 'notion') {
      const authHeader = Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64');
      
      const tokenRes = await axios.post('https://api.notion.com/v1/oauth/token', {
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NOTION_REDIRECT_URI
      }, {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json'
        }
      });

      finalTokens = tokenRes.data;
      await tokenStore.saveTokens(userId, 'notion', finalTokens);
    }

    // Success Landing Page with message bridge
    res.send(`
      <html>
        <body style="background: #050505; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center;">
          <div style="padding: 48px; border-radius: 32px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
            <div style="width: 64px; height: 64px; background: #6366f1; border-radius: 20px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(99,102,241,0.4);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.02em; margin: 0 0 8px;">NODE CONNECTED</h1>
            <p style="color: #64748b; font-size: 14px; font-weight: 500;">${provider.toUpperCase()} system is now indexed in NEXUS.</p>
            <div style="margin-top: 32px; display: flex; align-items: center; justify-content: center; gap: 8px;">
               <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>
               <span style="font-size: 10px; font-weight: 800; color: #475569; letter-spacing: 0.1em; uppercase;">Handshake Complete</span>
            </div>
          </div>
          <style>@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }</style>
          <script>
            window.opener.postMessage({ type: "${provider}_connected" }, "http://localhost:5173");
            setTimeout(() => { window.close(); }, 1000);
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(`[AuthController] Callback failed for ${provider}:`, err.message);
    res.status(500).send(`Authentication processing failed: ${err.message}`);
  }
}

/**
 * GET /api/connectors/status
 * Real-time status of all configured connectors.
 */
async function getStatus(req, res) {
  const { userId } = req.query;
  const targetUser = userId || 'me';

  try {
    const gmailConnected = await tokenStore.hasTokens(targetUser, 'gmail');
    const notionConnected = await tokenStore.hasTokens(targetUser, 'notion');

    res.json({
      gmail: gmailConnected,
      notion: notionConnected
    });
  } catch (error) {
    res.status(500).json({ error: 'Status check failed' });
  }
}

async function getGmailStatus(req, res) {
  const { userId } = req.query;
  const connected = await tokenStore.hasTokens(userId || 'me', 'gmail');
  res.json({ connected });
}

async function getNotionStatus(req, res) {
  const { userId } = req.query;
  const connected = await tokenStore.hasTokens(userId || 'me', 'notion');
  res.json({ connected });
}

module.exports = {
  initiateAuth,
  handleCallback,
  getStatus,
  getGmailStatus,
  getNotionStatus
};
