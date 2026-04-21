/**
 * Decision Controller
 * Routes between INITIAL and FOLLOW-UP decision modes.
 */
const { processInitial, processFollowUp } = require('../engines/decision/decisionPipeline');
const logger = require('../utils/logger');

async function handleDecision(req, res) {
  const { input, session_id, answers } = req.body;

  try {
    // Mode Detection
    if (session_id && answers && Array.isArray(answers)) {
      // MODE 2: Follow-up
      const result = await processFollowUp(session_id, answers);
      return res.status(200).json(result);
    } else if (input) {
      // MODE 1: Initial
      const result = await processInitial(input, session_id);
      return res.status(200).json(result);
    } else {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Provide "input" for initial request or "session_id" + "answers" for follow-up.'
      });
    }
  } catch (error) {
    logger.error('decision-controller', `Decision request failed: ${error.message}`);
    return res.status(error.message.includes('not found') ? 404 : 500).json({
      error: 'Decision processing failed',
      message: error.message
    });
  }
}

module.exports = { handleDecision };
