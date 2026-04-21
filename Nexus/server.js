require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// OAuth 2.0 Configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Helper to load existing token
function loadToken() {
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH);
    oauth2Client.setCredentials(JSON.parse(token));
    return true;
  }
  return false;
}

// 1. Auth Endpoint: Redirect to Google
app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  res.redirect(authUrl);
});

// 2. Callback Endpoint: Handle Google redirect
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // Save tokens for future use
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    res.send('Authentication successful! You can now use the /emails endpoint.');
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.status(500).send('Error during authentication');
  }
});

// 3. GET /emails: Fetch last 5 emails
app.get('/emails', async (req, res) => {
  if (!loadToken()) {
    return res.status(401).json({ error: 'Not authenticated. Go to /auth first.' });
  }

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  try {
    // List messages
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 5,
    });

    const messages = response.data.messages || [];
    const emailData = [];

    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });

      const headers = msg.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
      const snippet = msg.data.snippet;

      emailData.push({
        subject,
        snippet,
        from
      });
    }

    res.json(emailData);
  } catch (error) {
    console.error('The API returned an error: ' + error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Authenticate at http://localhost:${port}/auth`);
});
