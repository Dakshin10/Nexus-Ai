/**
 * Memory Validator Utility
 */
const logger = require('./logger');

const validateMemory = (data, stage = 'memory-validation') => {
  const errors = [];

  if (stage === 'extraction') {
    if (!Array.isArray(data.extracted_memory)) errors.push('extracted_memory must be an array');
    if (data.extracted_memory && data.extracted_memory.length > 5) errors.push('Extraction limit exceeded (max 5)');
  }

  if (stage === 'merge') {
    if (!Array.isArray(data.memory_items)) errors.push('memory_items must be an array');
    if (data.memory_items && data.memory_items.length > 25) errors.push('Memory storage limit exceeded (max 25)');
  }

  if (stage === 'pattern') {
    if (!Array.isArray(data.patterns)) errors.push('patterns must be an array');
  }

  if (stage === 'adaptation') {
    if (!data.risk_prediction) errors.push('Missing risk_prediction');
    if (!data.behavioral_suggestion) errors.push('Missing behavioral_suggestion');
  }

  if (errors.length > 0) {
    logger.error(stage, `Memory validation failed: ${errors.join(', ')}`);
    throw new Error(`Memory Validation Error: ${errors.join('; ')}`);
  }

  return true;
};

module.exports = { validateMemory };
