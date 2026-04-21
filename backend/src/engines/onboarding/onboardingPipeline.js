/**
 * Onboarding Pipeline
 */
const onboardingEngine = require('./onboardingEngine');
const preferenceEngine = require('./preferenceEngine');
const personalizationEngine = require('./personalizationEngine');
const guidanceEngine = require('./guidanceEngine');
const logger = require('../../utils/logger');

async function process(userId, context = {}) {
  const startTime = logger.time();
  
  try {
    const steps = await onboardingEngine.getSteps();
    const prefs = await preferenceEngine.detect(userId, context.history || []);
    const personal = await personalizationEngine.adjust(prefs, context.proficiency || 'beginner');
    const suggestions = await guidanceEngine.getGuidance(context);

    const result = {
      onboarding_steps: steps,
      user_type: prefs.type,
      ui_mode: personal.uiMode,
      suggestions,
      hidden_features: personal.hiddenFeatures
    };

    const duration = logger.timeEnd(startTime);
    logger.log('onboarding-pipeline', 'Onboarding & Personalization complete', duration);

    return result;
  } catch (error) {
    logger.error('onboarding-pipeline', `Pipeline failed: ${error.message}`);
    throw error;
  }
}

module.exports = { process };
