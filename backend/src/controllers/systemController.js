/**
 * System Controller
 * Unified entry point for the entire NEXUS AI backend.
 */
const { runSystem } = require('../system/systemPipeline');
const logger = require('../utils/logger');

async function handleRun(req, res) {
  const { input, user_id, context } = req.body;

  if (!input || !user_id) {
    return res.status(400).json({
      error: 'Invalid request',
      message: '"input" and "user_id" are required.'
    });
  }

  try {
    const result = await runSystem(input, user_id, context || {});
    return res.status(200).json(result);
  } catch (error) {
    logger.error('system-controller', `Unified run failed: ${error.message}`);
    return res.status(500).json({
      error: 'System execution failed',
      message: error.message
    });
  }
}

module.exports = { handleRun };
