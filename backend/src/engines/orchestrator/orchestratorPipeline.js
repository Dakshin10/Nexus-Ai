/**
 * Orchestrator Pipeline
 */
const intentEngine = require('./intentEngine');
const routingEngine = require('./routingEngine');
const planningEngine = require('./planningEngine');
const executionEngine = require('./executionEngine');
const logger = require('../../utils/logger');
const cache = require('../../utils/cache');

async function orchestrate(input, context = {}) {
  const startTime = logger.time();
  
  const cachedResult = cache.get({ type: 'orchestration', input });
  if (cachedResult) {
    logger.log('orchestrator-pipeline', 'Cache hit - skipping orchestration');
    return cachedResult;
  }

  try {
    // 1. Detect Intent
    const intent = await intentEngine.run(input);

    // 2. Select Module
    const routing = await routingEngine.run(intent);

    // 3. Define Plan
    const planning = await planningEngine.run({ intent, routing });

    // 4. Execute Plan
    const result = await executionEngine.run(planning.execution_plan, input, context);

    const finalOutput = {
      selected_module: routing.selected_module,
      confidence: routing.confidence,
      execution_plan: planning.execution_plan,
      result: result
    };

    cache.set({ type: 'orchestration', input }, finalOutput);

    const totalDuration = logger.timeEnd(startTime);
    logger.log('orchestrator-pipeline', 'System orchestration completed', totalDuration);

    return finalOutput;
  } catch (error) {
    logger.error('orchestrator-pipeline', `Orchestration failed: ${error.message}`);
    throw error;
  }
}

module.exports = { orchestrate };
