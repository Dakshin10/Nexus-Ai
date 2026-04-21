/**
 * External Controller
 * Handles real-world data ingestion (Gmail, text) and semantic processing.
 */
const emailAIEngine = require('../engines/external/emailAIEngine');
const gmailIngestionEngine = require('../engines/external/gmailIngestionEngine');
const gmailService = require('../services/gmailService');
const logger = require('../utils/logger');

async function handleGetEmails(req, res) {
  const { analyze } = req.query;
  try {
    const emails = await gmailIngestionEngine.ingest({ count: 10, userId: 'me' });
    
    if (analyze === 'true') {
      const insights = await emailAIEngine.process(emails);
      return res.status(200).json({ emails, insights });
    }
    
    return res.status(200).json(emails);
  } catch (error) {
    logger.error('external-controller', `Gmail ingestion failed: ${error.message}`);
    return res.status(error.message.includes('No tokens') ? 401 : 500).json({
      error: 'Gmail integration error',
      message: error.message,
      auth_url: error.message.includes('No tokens') ? gmailService.getAuthUrl() : null
    });
  }
}

async function handleOAuth2Callback(req, res) {
  const { code } = req.query;
  try {
    await gmailService.setTokens(code);
    return res.send('Gmail authentication successful! You can now close this window.');
  } catch (error) {
    logger.error('external-controller', `OAuth callback failed: ${error.message}`);
    return res.status(500).send('Authentication failed');
  }
}

async function handleProcess(req, res) {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: 'Input required' });

  try {
    const result = await processExternal(input);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('external-controller', `Processing failed: ${error.message}`);
    return res.status(500).json({ error: 'Ingestion failed', message: error.message });
  }
}

async function handleAnalyzeBatch(req, res) {
  const { inputs } = req.body;
  if (!inputs || !Array.isArray(inputs)) return res.status(400).json({ error: 'Array of inputs required' });

  try {
    const results = await Promise.all(inputs.map(input => processExternal(input)));
    return res.status(200).json(results);
  } catch (error) {
    logger.error('external-controller', `Batch processing failed: ${error.message}`);
    return res.status(500).json({ error: 'Batch ingestion failed', message: error.message });
  }
}

module.exports = { 
  handleGetEmails, 
  handleOAuth2Callback, 
  handleProcess, 
  handleAnalyzeBatch 
};
