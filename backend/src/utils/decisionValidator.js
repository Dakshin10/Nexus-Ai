/**
 * Decision Validator Utility
 */
const logger = require('./logger');

const validateDecision = (data, stage = 'decision-validation') => {
  const errors = [];

  if (stage === 'extraction') {
    if (!data.decision) errors.push('Missing decision field');
    if (!Array.isArray(data.options)) errors.push('Options must be an array');
  }

  if (stage === 'questions') {
    if (!Array.isArray(data.questions) || data.questions.length !== 3) {
      errors.push('Questions must be an array of length 3');
    }
  }

  if (stage === 'analysis') {
    if (!Array.isArray(data.options)) errors.push('Options must be an array');
    data.options?.forEach((opt, idx) => {
      if (!opt.option || !opt.score) errors.push(`Option ${idx} is missing required fields`);
      if (opt.score < 1 || opt.score > 10) errors.push(`Option ${idx} score out of range (1-10)`);
    });
  }

  if (stage === 'recommendation') {
    if (!data.recommended_option) errors.push('Missing recommended_option');
    if (!data.reasoning) errors.push('Missing reasoning');
  }

  if (errors.length > 0) {
    logger.error(stage, `Decision validation failed: ${errors.join(', ')}`);
    throw new Error(`Decision Validation Error: ${errors.join('; ')}`);
  }

  return true;
};

module.exports = { validateDecision };
