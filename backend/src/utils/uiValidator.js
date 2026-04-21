/**
 * UI Validator Utility
 */
const logger = require('./logger');

const validateUI = (data, stage = 'ui-validation') => {
  const errors = [];

  if (stage === 'normalization') {
    const required = ['summary', 'tasks', 'ideas', 'questions', 'emotions', 'decisions', 'cognitive_load'];
    required.forEach(k => {
      if (data[k] === undefined) errors.push(`Missing field: ${k}`);
    });
  }

  if (stage === 'attention') {
    if (!Array.isArray(data.ordered_sections)) errors.push('ordered_sections must be an array');
    if (!Array.isArray(data.highlight_items)) errors.push('highlight_items must be an array');
    if (data.highlight_items && data.highlight_items.length > 3) errors.push('highlight_items cannot exceed 3');
  }

  if (stage === 'transformation') {
    if (!Array.isArray(data.sections)) errors.push('sections must be an array');
    data.sections?.forEach((s, i) => {
      if (!s.key || !s.title || !Array.isArray(s.items)) {
        errors.push(`Invalid section structure at index ${i}`);
      }
    });
  }

  if (stage === 'state') {
    const validTones = ['calm', 'focused', 'urgent'];
    const validIntensities = ['green', 'yellow', 'red'];
    if (!validTones.includes(data.tone)) errors.push(`Invalid tone: ${data.tone}`);
    if (!validIntensities.includes(data.intensity)) errors.push(`Invalid intensity: ${data.intensity}`);
  }

  if (errors.length > 0) {
    logger.error(stage, `UI validation failed: ${errors.join(', ')}`);
    throw new Error(`UI Validation Error: ${errors.join('; ')}`);
  }

  return true;
};

module.exports = { validateUI };
