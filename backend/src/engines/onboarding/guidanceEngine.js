/**
 * Guidance Engine
 * Provides contextual tooltips, hints, and help messages.
 */
const logger = require('../../utils/logger');

async function getGuidance(context) {
  const guidance = [];

  if (context.hasGmail === false) {
    guidance.push("Try adding your emails for better results");
  }

  if (context.lastAction === 'input' && context.outputComplexity > 7) {
    guidance.push("Feeling overwhelmed? Focus on the TOP PRIORITY first.");
  }

  return guidance;
}

module.exports = { getGuidance };
