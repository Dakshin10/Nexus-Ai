/**
 * System Pipeline Orchestrator
 * The central brain that executes the full NEXUS cognitive loop.
 */
const { orchestrate } = require('../engines/orchestrator/orchestratorPipeline');
const moduleRegistry = require('./moduleRegistry');
const { composeResponse } = require('./responseComposer');
const { handleSystemError } = require('./errorHandler');
const logger = require('../utils/logger');

async function runSystem(input, userId, context = {}) {
  const startTime = logger.time();
  logger.log('system-pipeline', `Starting NEXUS execution loop for user: ${userId}`);

  try {
    // 1. Orchestrate (Detect Intent & Plan)
    const orchestration = await orchestrate(input, { ...context, user_id: userId });

    const executionResults = {};
    let currentInput = input;

    // 2. Execute Planned Modules in Sequence
    for (const moduleName of orchestration.execution_plan) {
      if (!moduleRegistry[moduleName]) {
        logger.error('system-pipeline', `Module ${moduleName} not found in registry`);
        continue;
      }

      logger.log('system-pipeline', `Executing module: ${moduleName}`);
      
      try {
        // Dynamic execution based on module requirements
        let result;
        if (moduleName === 'memory_engine' || moduleName === 'prediction_engine') {
          result = await moduleRegistry[moduleName](currentInput, { ...context, user_id: userId });
        } else {
          result = await moduleRegistry[moduleName](currentInput, context);
        }

        executionResults[moduleName] = result;
        
        // Pass results forward as context/input where logical
        if (moduleName === 'stream_engine') currentInput = result;
      } catch (modError) {
        executionResults[moduleName] = handleSystemError(modError, moduleName);
      }
    }

    const duration = logger.timeEnd(startTime);
    return composeResponse(orchestration, executionResults, duration);

  } catch (error) {
    return handleSystemError(error, 'orchestrator');
  }
}

module.exports = { runSystem };
