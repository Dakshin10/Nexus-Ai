/**
 * UI Controller
 */
const { processUI } = require('../engines/ui/uiPipeline');
const logger = require('../utils/logger');

async function handleUIProcess(req, res) {
  const cognitiveOutput = req.body;

  if (!cognitiveOutput || typeof cognitiveOutput !== 'object') {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Cognitive output object is required in the request body.'
    });
  }

  try {
    const result = await processUI(cognitiveOutput);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('ui-controller', `UI request failed: ${error.message}`);
    
    // Fallback UI State
    return res.status(200).json({
      ordered_sections: ['summary'],
      highlight_items: [],
      sections: [{ key: 'summary', title: 'System Status', items: ['UI Engine is temporarily degraded.'], empty_state: 'No data' }],
      ui_state: { tone: 'calm', intensity: 'yellow', animation_level: 'low' }
    });
  }
}

module.exports = { handleUIProcess };
