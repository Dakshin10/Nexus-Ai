/**
 * Connector Registry (Backend)
 * Central configuration for all external integrations.
 */

const CONNECTORS = {
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    provider: 'google',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
    authUrl: '/auth/google',
  },
  notion: {
    id: 'notion',
    name: 'Notion',
    provider: 'notion',
    scopes: [], // Notion handles scopes in the auth prompt differently
    authUrl: '/auth/notion',
  }
};

module.exports = { CONNECTORS };
