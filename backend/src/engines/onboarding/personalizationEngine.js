/**
 * Personalization Engine
 * Adjusts UI mode and suggestion styles based on user proficiency and type.
 */
const logger = require('../../utils/logger');

async function adjust(preferences, proficiencyLevel = 'beginner') {
  logger.log('personalization-engine', 'Adjusting system behavior...');

  const uiMode = proficiencyLevel === 'beginner' ? 'simple' : 'advanced';
  const suggestionStyle = preferences.type === 'builder' ? 'technical' : 'action-oriented';

  const hiddenFeatures = uiMode === 'simple' ? ['knowledge-graph', 'deep-analysis'] : [];

  return { uiMode, suggestionStyle, hiddenFeatures };
}

module.exports = { adjust };
