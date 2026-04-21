/**
 * External Controller
 * Handles real-world data ingestion (Gmail, text) and semantic processing.
 */
const { processExternal } = require('../engines/external/externalPipeline');
const gmailService = require('../services/gmailService');
const logger = require('../utils/logger');

async function handleGetEmails(req, res) {
  try {
    const emails = await gmailService.fetchEmails(5);
    return res.status(200).json(emails);
  } catch (error) {
    logger.error('external-controller', `Gmail fetch failed: ${error.message}`);
    return res.status(error.message.includes('Not authenticated') ? 401 : 500).json({
      error: 'Gmail integration error',
      message: error.message,
      auth_url: error.message.includes('Not authenticated') ? gmailService.getAuthUrl() : null
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
