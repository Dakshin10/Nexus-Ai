/**
 * Orchestrator Controller
 */
const { orchestrate } = require('../engines/orchestrator/orchestratorPipeline');
const logger = require('../utils/logger');

async function handleOrchestrate(req, res) {
  const { input, context } = req.body;

  if (!input) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Input string is required in the request body.'
    });
  }

  try {
    const result = await orchestrate(input, context || {});
    return res.status(200).json(result);
  } catch (error) {
    logger.error('orchestrator-controller', `Orchestration request failed: ${error.message}`);
    return res.status(500).json({
      error: 'Orchestration failed',
      message: error.message
    });
  }
}

async function handleUnifiedSync(req, res) {
  try {
    // This will eventually trigger the real sync logic
    // For now, it returns a successful mock to unblock the frontend
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      tasks: {
        doNow: [],
        doNext: [],
        later: []
      }
    });
  } catch (error) {
    logger.error('orchestrator-controller', `Unified sync failed: ${error.message}`);
    return res.status(500).json({
      error: 'Unified sync failed',
      message: error.message
    });
  }
}

module.exports = { 
  handleOrchestrate,
  handleUnifiedSync
};
