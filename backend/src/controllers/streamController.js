/**
 * Stream Controller
 * Handles incoming API requests and manages pipeline lifecycle.
 */
const { processStream } = require('../engines/stream/streamPipeline');
const logger = require('../utils/logger');

async function handleStream(req, res) {
  const { input } = req.body;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Input string is required in the request body.'
    });
  }

  try {
    const result = await processStream(input);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('controller', `Request failed: ${error.message}`);
    
    // Fallback response for production robustness
    return res.status(200).json({
      summary: 'Unable to process detailed reasoning at this time.',
      tasks: [],
      ideas: [],
      questions: [],
      emotions: [],
      decisions: [],
      urgent: [],
      top_priority: 'Stabilize system state',
      recommended_action: 'Check logs for pipeline errors.',
      cognitive_load: { score: 0, status: 'red' },
      _error: error.message
    });
  }
}

module.exports = { handleStream };
