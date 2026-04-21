/**
 * Effort Elimination Pipeline
 * Transforms complex external intelligence into clear, zero-ambiguity actions.
 */
const simplificationEngine = require('./simplificationEngine');
const actionGroupingEngine = require('./actionGroupingEngine');
const quickActionEngine = require('./quickActionEngine');
const frictionReductionEngine = require('./frictionReductionEngine');
const logger = require('../../utils/logger');

async function processEffortElimination(enrichedItems) {
  logger.log('effort-pipeline', `Starting effort elimination for ${enrichedItems.length} items`);

  try {
    // 1. Simplify Statements
    const simplified = await simplificationEngine.run(enrichedItems);

    // 2. Group Actions
    const grouped = await actionGroupingEngine.run({ items: enrichedItems, simplified: simplified.simplified_items });

    // 3. Generate Quick Actions
    const quick = await quickActionEngine.run(grouped.groups);

    // 4. Reduce Friction & Generate Focus Message
    const reduced = await frictionReductionEngine.run({ groups: grouped.groups, quickActions: quick.quick_actions });

    return {
      do_now: reduced.cleaned_groups.do_now,
      do_next: reduced.cleaned_groups.do_next,
      later: reduced.cleaned_groups.later,
      quick_actions: quick.quick_actions,
      focus_message: reduced.focus_message
    };
  } catch (error) {
    logger.error('effort-pipeline', `Effort elimination failed: ${error.message}`);
    throw error;
  }
}

module.exports = { processEffortElimination };
