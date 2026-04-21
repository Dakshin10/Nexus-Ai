/**
 * Gmail Service
 * Handles OAuth2 authentication and email retrieval for the NEXUS system.
 */
const { google } = require('googleapis');
const tokenStore = require('../utils/tokenStore');

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify' // Added modify for potential future use
];

class GmailService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Error handling for missing credentials
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.warn('[GmailService] Missing Google OAuth credentials. Integration will be inactive.');
    }
  }

  /**
   * Generate Auth URL
   */
  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent' // Force consent to ensure we always get a refresh token
    });
  }

  /**
   * Exchange code for tokens
   */
  async setTokens(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      console.error('[GmailService] Token Exchange Error:', error.message);
      throw error;
    }
  }

  /**
   * Load tokens from store and set credentials
   */
  async loadUserTokens(userId = 'me') {
    const tokens = await tokenStore.getTokens(userId);
    if (tokens) {
      this.oauth2Client.setCredentials(tokens);
      return true;
    }
    return false;
  }

  /**
   * Fetch latest emails
   */
  /**
   * Fetch latest emails
   */
  async fetchEmails(count = 5, query = '', userId = 'me') {
    const hasTokens = await this.loadUserTokens(userId);
    if (!hasTokens) {
      console.warn('[GmailService] No tokens found for user:', userId);
      return [];
    }

    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      
      const response = await gmail.users.messages.list({ 
        userId: 'me', 
        q: query || 'category:primary OR is:important -category:promotions -category:social',
        maxResults: count 
      });
      
      const messages = response.data.messages || [];
      const emailData = [];

      for (const message of messages) {
        const details = await this.getMessageDetails(message.id, userId);
        if (details) emailData.push(details);
      }

      return emailData;
    } catch (error) {
      console.error('[GmailService] Gmail Fetch Error:', error.message);
      
      if (error.message.includes('invalid_grant') || error.code === 401) {
        console.warn('[GmailService] Token invalid or expired. Deleting from store.');
        await tokenStore.deleteTokens(userId);
      }
      
      return [];
    }
  }

  /**
   * Get full details of a single message
   */
  async getMessageDetails(messageId, userId = 'me') {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      const msg = await gmail.users.messages.get({ userId: 'me', id: messageId });
      const headers = msg.data.payload.headers;
      
      return {
        id: messageId,
        subject: headers.find(h => h.name === 'Subject')?.value || 'No Subject',
        sender: headers.find(h => h.name === 'From')?.value || 'Unknown',
        snippet: msg.data.snippet,
        timestamp: msg.data.internalDate,
        date: headers.find(h => h.name === 'Date')?.value,
        labels: msg.data.labelIds
      };
    } catch (error) {
      console.error(`[GmailService] Failed to fetch message ${messageId}:`, error.message);
      return null;
    }
  }
}

module.exports = new GmailService();


