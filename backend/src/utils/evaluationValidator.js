/**
 * Evaluation Validator Utility
 */
const logger = require('./logger');

const validateEvaluation = (data, stage = 'evaluation-validation') => {
  const errors = [];

  if (stage === 'scoring') {
    if (typeof data.score !== 'number' || data.score < 0 || data.score > 100) {
      errors.push('score must be a number between 0 and 100');
    }
    if (!data.breakdown) errors.push('Missing score breakdown');
  }

  if (stage === 'issues') {
    if (!Array.isArray(data.issues)) errors.push('issues must be an array');
  }

  if (stage === 'improvement') {
    if (!Array.isArray(data.improvement_suggestions)) errors.push('improvement_suggestions must be an array');
  }

  if (errors.length > 0) {
    logger.error(stage, `Evaluation validation failed: ${errors.join(', ')}`);
    throw new Error(`Evaluation Validation Error: ${errors.join('; ')}`);
  }

  return true;
};

module.exports = { validateEvaluation };
