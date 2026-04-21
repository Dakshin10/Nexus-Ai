/**
 * Trigger Engine
 * Detects specific conditions that warrant a proactive intervention.
 */
const logger = require('../../utils/logger');

async function run(state) {
  logger.log('trigger-engine', 'Evaluating trigger conditions...');
  
  const triggers = [];

  // Condition 1: Task Delayed (Heuristic)
  if (state.behavioral_suggestion && state.behavioral_suggestion.toLowerCase().includes('delay')) {
    triggers.push({ type: 'DELAYED_TASK', severity: 'high' });
  }

  // Condition 2: High Cognitive Load
  if (state.cognitive_load > 80) {
    triggers.push({ type: 'COGNITIVE_OVERLOAD', severity: 'high' });
  }

  // Condition 3: Inactivity (Simulated)
  const idleTime = (Date.now() - state.last_active) / 1000;
  if (idleTime > 3600) { // 1 hour
    triggers.push({ type: 'INACTIVITY', severity: 'low' });
  }

  // Only return high-value triggers
  return triggers.filter(t => t.severity === 'high' || t.severity === 'medium');
}

module.exports = { run };
