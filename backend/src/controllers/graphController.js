/**
 * Graph Controller
 */
const { processGraph } = require('../engines/graph/graphPipeline');
const logger = require('../utils/logger');

async function handleGraph(req, res) {
  const { classified_thoughts } = req.body;

  if (!classified_thoughts || !Array.isArray(classified_thoughts)) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'classified_thoughts array is required in the request body.'
    });
  }

  try {
    const result = await processGraph(classified_thoughts);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('graph-controller', `Graph request failed: ${error.message}`);
    
    return res.status(500).json({
      error: 'Graph processing failed',
      message: error.message
    });
  }
}

module.exports = { handleGraph };
