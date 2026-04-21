/**
 * Alert Engine
 * Formats the final proactive output for the user.
 */
const logger = require('../../utils/logger');

async function run(recommendation) {
  if (!recommendation) return null;

  logger.log('alert-engine', 'Formatting proactive alert...');

  let alert = '';
  const { action, triggerType } = recommendation;

  switch (triggerType) {
    case 'DELAYED_TASK':
      alert = `🚨 High Priority: ${action}`;
      break;
    case 'COGNITIVE_OVERLOAD':
      alert = `🧠 Overload Detected: ${action}`;
      break;
    default:
      alert = `💡 Intelligence Update: ${action}`;
  }

  return {
    alert,
    action: recommendation.correction,
    priority: triggerType === 'INACTIVITY' ? 'low' : 'high'
  };
}

module.exports = { run };
