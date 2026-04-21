/**
 * Recommendation Engine
 * Generates one high-impact action and one behavioral correction based on triggers.
 */
const logger = require('../../utils/logger');

async function run(triggers, state) {
  logger.log('recommendation-engine', 'Generating proactive recommendations...');
  
  if (triggers.length === 0) return null;

  const primaryTrigger = triggers[0];
  let action = '';
  let correction = '';

  switch (primaryTrigger.type) {
    case 'DELAYED_TASK':
      action = `Start the ${state.pending_tasks[0]?.text || 'pending task'} now.`;
      correction = "Try breaking this task into 5-minute segments to build momentum.";
      break;
    case 'COGNITIVE_OVERLOAD':
      action = "Pause all secondary tasks immediately.";
      correction = "Focus on a single singular objective to reduce mental strain.";
      break;
    default:
      action = "Review your current priority list.";
      correction = "Align your actions with your primary long-term goal.";
  }

  return { action, correction, triggerType: primaryTrigger.type };
}

module.exports = { run };
