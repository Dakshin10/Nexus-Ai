/**
 * Prediction Validator Utility
 */
const logger = require('./logger');

const validatePrediction = (data, stage = 'prediction-validation') => {
  const errors = [];

  if (stage === 'context') {
    if (typeof data.consistency_score !== 'number' || data.consistency_score < 0 || data.consistency_score > 100) {
      errors.push('consistency_score must be a number between 0 and 100');
    }
  }

  if (stage === 'prediction') {
    if (data.completion_probability === undefined || typeof data.completion_probability !== 'number') {
      errors.push('completion_probability is missing or not a number');
    } else if (data.completion_probability < 0 || data.completion_probability > 100) {
      errors.push(`completion_probability must be between 0-100 (got ${data.completion_probability})`);
    }

    const validImpact = ['low', 'medium', 'high', 'transformative'];
    const validDifficulty = ['easy', 'moderate', 'hard'];
    if (!validImpact.includes(data.impact)) errors.push(`Invalid impact: ${data.impact}`);
    if (!validDifficulty.includes(data.difficulty)) errors.push(`Invalid difficulty: ${data.difficulty}`);
  }

  if (stage === 'intervention') {
    if (!data.intervention) errors.push('Missing intervention string');
    if (!data.next_step) errors.push('Missing next_step string');
  }

  if (errors.length > 0) {
    logger.error(stage, `Prediction validation failed: ${errors.join(', ')}`);
    throw new Error(`Prediction Validation Error: ${errors.join('; ')}`);
  }

  return true;
};

module.exports = { validatePrediction };
