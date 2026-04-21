/**
 * Proactive Pipeline Orchestrator
 */
const monitoringEngine = require('./monitoringEngine');
const triggerEngine = require('./triggerEngine');
const recommendationEngine = require('./recommendationEngine');
const alertEngine = require('./alertEngine');
const logger = require('../../utils/logger');

async function runPipeline(userId = 'default_user') {
  const startTime = logger.time();
  logger.log('proactive-pipeline', 'Starting proactive analysis loop...');

  try {
    // 1. Scan State
    const state = await monitoringEngine.run(userId);

    // 2. Detect Triggers
    const triggers = await triggerEngine.run(state);

    if (triggers.length === 0) {
      logger.log('proactive-pipeline', 'No actionable triggers detected. Sleeping.');
      return null;
    }

    // 3. Generate Recommendations
    const recommendation = await recommendationEngine.run(triggers, state);

    // 4. Format Alert
    const output = await alertEngine.run(recommendation);

    const duration = logger.timeEnd(startTime);
    logger.log('proactive-pipeline', 'Proactive loop completed', duration);

    return output;
  } catch (error) {
    logger.error('proactive-pipeline', `Loop failed: ${error.message}`);
    return null;
  }
}

module.exports = { runPipeline };
