/**
 * Execution Engine
 * Central dispatcher that triggers actual pipelines and combines outputs.
 */
const { processStream } = require('../stream/streamPipeline');
const { processGraph } = require('../graph/graphPipeline');
const { processUI } = require('../ui/uiPipeline');
const { processInitial } = require('../decision/decisionPipeline');
const { processMemory } = require('../memory/memoryPipeline');
const logger = require('../../utils/logger');

async function run(plan, input, context = {}) {
  logger.log('orchestrator-execution', `Executing plan: ${plan.join(' -> ')}`);
  
  let currentData = input;
  let finalResult = {};

  try {
    for (const module of plan) {
      logger.log('orchestrator-execution', `Triggering module: ${module}`);
      
      let moduleResult;
      switch (module) {
        case 'stream_engine':
          moduleResult = await processStream(currentData);
          finalResult.stream = moduleResult;
          currentData = moduleResult; // Pass output to next stage if needed
          break;
        case 'graph_engine':
          // Graph engine needs classified thoughts from stream if available
          const graphInput = finalResult.stream?.tasks ? 
            [...finalResult.stream.tasks, ...finalResult.stream.ideas].map(t => ({ text: t, type: 'task' })) : 
            currentData;
          moduleResult = await processGraph(graphInput);
          finalResult.graph = moduleResult;
          break;
        case 'ui_processing':
          moduleResult = await processUI(finalResult.stream || currentData);
          finalResult.ui = moduleResult;
          break;
        case 'decision_engine':
          moduleResult = await processInitial(currentData);
          finalResult.decision = moduleResult;
          break;
        case 'memory_engine':
          moduleResult = await processMemory(finalResult.stream || currentData, context.memory || {});
          finalResult.memory = moduleResult;
          break;
        default:
          logger.log('orchestrator-execution', `Warning: Module ${module} not yet fully integrated.`);
      }
    }

    return finalResult;
  } catch (error) {
    logger.error('orchestrator-execution', `Execution failed at module: ${error.message}`);
    throw error;
  }
}

module.exports = { run };
