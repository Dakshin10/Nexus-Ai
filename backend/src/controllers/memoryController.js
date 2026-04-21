/**
 * Memory Controller
 * Manages long-term user memory retrieval and updates.
 */
const { processMemory } = require('../engines/memory/memoryPipeline');
const memoryStore = require('../utils/memoryStore');
const logger = require('../utils/logger');

async function handleMemoryUpdate(req, res) {
  const { user_id, current_data } = req.body;

  if (!user_id || !current_data) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'user_id and current_data are required in the request body.'
    });
  }

  try {
    // 1. Fetch existing memory
    const existingMemory = memoryStore.getMemory(user_id);

    // 2. Run memory pipeline
    const updatedState = await processMemory(current_data, existingMemory);

    // 3. Update storage
    memoryStore.updateMemory(user_id, updatedState);

    return res.status(200).json(updatedState);
  } catch (error) {
    logger.error('memory-controller', `Memory request failed: ${error.message}`);
    return res.status(500).json({
      error: 'Memory processing failed',
      message: error.message
    });
  }
}

module.exports = { handleMemoryUpdate };
