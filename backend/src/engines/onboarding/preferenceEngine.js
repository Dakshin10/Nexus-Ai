/**
 * Preference Engine
 * Detects user type and usage style based on interaction history.
 */
const logger = require('../../utils/logger');

async function detect(userId, usageHistory = []) {
  logger.log('preference-engine', `Analyzing preferences for user: ${userId}`);
  
  // Heuristic detection based on keyword frequency in history
  const content = usageHistory.map(h => h.text).join(' ').toLowerCase();
  
  let type = 'professional';
  if (content.includes('study') || content.includes('exam') || content.includes('lecture')) type = 'student';
  if (content.includes('build') || content.includes('code') || content.includes('architecture')) type = 'builder';

  const style = usageHistory.length > 5 ? 'deep thinking' : 'quick tasks';

  return { type, style };
}

module.exports = { detect };
