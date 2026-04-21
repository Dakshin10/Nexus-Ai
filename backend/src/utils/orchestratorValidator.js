/**
 * Orchestrator Validator Utility
 */
const logger = require('./logger');

const validateOrchestration = (data, stage = 'orchestrator-validation') => {
  const errors = [];

  const validModules = [
    'stream_engine', 
    'decision_engine', 
    'graph_engine', 
    'memory_engine', 
    'prediction_engine', 
    'context_switch', 
    'ui_processing'
  ];

  if (stage === 'routing') {
    if (!validModules.includes(data.selected_module)) {
      errors.push(`Invalid module selected: ${data.selected_module}`);
    }
    if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 100) {
      errors.push(`Confidence score out of range: ${data.confidence}`);
    }
  }

  if (stage === 'planning') {
    if (!Array.isArray(data.execution_plan) || data.execution_plan.length === 0) {
      errors.push('Execution plan must be a non-empty array');
    }
    data.execution_plan?.forEach(m => {
      if (!validModules.includes(m)) errors.push(`Invalid module in plan: ${m}`);
    });
  }

  if (errors.length > 0) {
    logger.error(stage, `Orchestrator validation failed: ${errors.join(', ')}`);
    throw new Error(`Orchestrator Validation Error: ${errors.join('; ')}`);
  }

  return true;
};

module.exports = { validateOrchestration };
