/**
 * Weekly Validator Utility
 */
const logger = require('./logger');

const validateWeekly = (data, stage = 'weekly-validation') => {
  const errors = [];

  if (stage === 'consolidation') {
    if (!Array.isArray(data.themes)) errors.push('themes must be an array');
    data.themes?.forEach(t => {
      if (!t.name || typeof t.count !== 'number') errors.push(`Invalid theme: ${JSON.stringify(t)}`);
    });
  }

  if (stage === 'narrative') {
    if (!data.weekly_summary) errors.push('Missing weekly_summary');
    if (data.weekly_summary && data.weekly_summary.split(/[.!?]/).filter(s => s.trim()).length > 3) {
      errors.push('Weekly summary exceeds 3 sentences');
    }
    if (!Array.isArray(data.next_week_focus) || data.next_week_focus.length !== 3) {
      errors.push('next_week_focus must contain exactly 3 items');
    }
  }

  if (errors.length > 0) {
    logger.error(stage, `Weekly validation failed: ${errors.join(', ')}`);
    throw new Error(`Weekly Validation Error: ${errors.join('; ')}`);
  }

  return true;
};

module.exports = { validateWeekly };
