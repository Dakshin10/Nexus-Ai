/**
 * External Validator Utility
 */
const logger = require('./logger');

const validateExternal = (data, stage = 'external-validation') => {
  const errors = [];

  if (stage === 'extraction') {
    if (!data.core_message) errors.push('Missing core_message');
  }

  if (stage === 'action') {
    if (typeof data.action_required !== 'boolean') errors.push('action_required must be boolean');
    const validPriorities = ['high', 'medium', 'low'];
    if (data.priority && !validPriorities.includes(data.priority)) {
      errors.push(`Invalid priority: ${data.priority}`);
    }
  }

  if (stage === 'conversion') {
    if (!data.summary) errors.push('Missing summary');
    const validClassifications = ['task', 'idea', 'decision', 'info'];
    if (!validClassifications.includes(data.classification)) {
      errors.push(`Invalid classification: ${data.classification}`);
    }
  }

  if (stage === 'advanced') {
    if (data.items && !Array.isArray(data.items)) errors.push('Items must be an array');
    if (data.conflicts && !Array.isArray(data.conflicts)) errors.push('Conflicts must be an array');
    data.items?.forEach(item => {
      if (!item.source || !item.reliability) errors.push('Item missing source metadata');
      // Enrichment validation
      if (typeof item.urgency_score === 'number' && (item.urgency_score < 0 || item.urgency_score > 100)) {
        errors.push('urgency_score out of range');
      }
      if (item.dependencies && !Array.isArray(item.dependencies)) errors.push('dependencies must be an array');
      if (item.context_links && !Array.isArray(item.context_links)) errors.push('context_links must be an array');
    });
  }



  if (errors.length > 0) {
    logger.error(stage, `External validation failed: ${errors.join(', ')}`);
    throw new Error(`External Validation Error: ${errors.join('; ')}`);
  }

  return true;
};

module.exports = { validateExternal };
