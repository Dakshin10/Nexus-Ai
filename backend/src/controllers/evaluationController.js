/**
 * Evaluation Controller
 */
const { evaluateOutput } = require('../engines/evaluation/evaluationPipeline');
const evaluationStore = require('../utils/evaluationStore');
const logger = require('../utils/logger');

async function handleEvaluate(req, res) {
  const { module, output, user_feedback } = req.body;

  if (!module || !output) {
    return res.status(400).json({
      error: 'Invalid request',
      message: '"module" and "output" are required in the request body.'
    });
  }

  try {
    const result = await evaluateOutput(module, output, user_feedback);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('evaluation-controller', `Evaluation request failed: ${error.message}`);
    return res.status(500).json({
      error: 'Evaluation failed',
      message: error.message
    });
  }
}

async function handleGetStats(req, res) {
  const { module } = req.query;
  try {
    const stats = evaluationStore.getStats(module);
    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

module.exports = { handleEvaluate, handleGetStats };
