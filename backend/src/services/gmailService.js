/**
 * Gmail Service
 * Handles OAuth2 authentication and email retrieval for the NEXUS system.
 */
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(__dirname, '../utils/token.json');

class GmailService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI || 'http://localhost:3001/api/external/oauth2callback'
    );
  }

  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });
  }

  async setTokens(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    return tokens;
  }

  loadToken() {
    if (fs.existsSync(TOKEN_PATH)) {
      const token = fs.readFileSync(TOKEN_PATH);
      this.oauth2Client.setCredentials(JSON.parse(token));
      return true;
    }
    return false;
  }

  async fetchEmails(count = 5) {
    if (!this.loadToken()) return [];

    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      
      // Intelligent Query: Only primary inbox and important emails
      // Exclude: Promotions, Social, Spam
      const query = 'category:primary OR is:important -category:promotions -category:social';
      
      const response = await gmail.users.messages.list({ 
        userId: 'me', 
        q: query,
        maxResults: count 
      });
      
      const messages = response.data.messages || [];
      const emailData = [];

      for (const message of messages) {
        try {
          const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });
          const headers = msg.data.payload.headers;
          
          const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
          const sender = headers.find(h => h.name === 'From')?.value || 'Unknown';
          const snippet = msg.data.snippet;

          // Note: In a full implementation, we would call the AI filter layer here.
          // For now, we use a heuristic-based priority.
          const isActionable = snippet.toLowerCase().includes('need') || 
                               snippet.toLowerCase().includes('please') || 
                               snippet.toLowerCase().includes('task');

          emailData.push({
            id: message.id,
            subject,
            sender,
            snippet,
            importance: isActionable ? 'high' : 'medium'
          });
        } catch (e) {
          logger.error('gmail-service', `Failed to fetch ${message.id}: ${e.message}`);
        }
      }

      // Final Filter: Only keep non-junk and max 5
      return emailData.slice(0, 5);
    } catch (error) {
      logger.error('gmail-service', `Gmail Fetch Error: ${error.message}`);
      return [];
    }
  }


}

module.exports = new GmailService();
