/**
 * Stream Validator
 */
const logger = require('./logger');

const validateStreamInput = (input) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }
  
  // Production constraint: Max 5000 characters
  if (input.length > 5000) {
    throw new Error('Input too long (max 5000 characters)');
  }

  return true;
};

const validateStreamOutput = (data, stage) => {
  if (stage === 'decomposition') {
    if (!data.atomic_thoughts || !Array.isArray(data.atomic_thoughts)) {
      throw new Error('Missing atomic_thoughts array in decomposition output');
    }
  }
  
  if (stage === 'classification') {
    if (!data.classified || !Array.isArray(data.classified)) {
      throw new Error('Missing classified array in classification output');
    }
  }

  return true;
};

module.exports = { validateStreamInput, validateStreamOutput };
