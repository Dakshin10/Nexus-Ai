/**
 * Prediction Controller
 * Handles behavioral forecasting requests and integrates with long-term memory.
 */
const { processPrediction } = require('../engines/prediction/predictionPipeline');
const memoryStore = require('../utils/memoryStore');
const logger = require('../utils/logger');

async function handlePredict(req, res) {
  const { item, user_id } = req.body;

  if (!item || !user_id) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'item and user_id are required in the request body.'
    });
  }

  try {
    // 1. Fetch user memory for behavioral context
    const userMemory = memoryStore.getMemory(user_id);

    // 2. Run prediction pipeline
    const result = await processPrediction(item, userMemory);

    return res.status(200).json(result);
  } catch (error) {
    logger.error('prediction-controller', `Prediction request failed: ${error.message}`);
    return res.status(500).json({
      error: 'Forecasting failed',
      message: error.message
    });
  }
}

module.exports = { handlePredict };
