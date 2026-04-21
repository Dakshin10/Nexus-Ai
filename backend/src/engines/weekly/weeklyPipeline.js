/**
 * Weekly Pipeline Orchestrator
 */
const consolidationEngine = require('./consolidationEngine');
const patternEngine = require('./patternEngine');
const insightEngine = require('./insightEngine');
const narrativeEngine = require('./narrativeEngine');
const logger = require('../../utils/logger');
const cache = require('../../utils/cache');

async function processWeekly(data) {
  const startTime = logger.time();
  
  const cachedResult = cache.get({ type: 'weekly', input: data });
  if (cachedResult) {
    logger.log('weekly-pipeline', 'Cache hit - skipping weekly report generation');
    return cachedResult;
  }

  const results = {};

  try {
    // Stage 1: Consolidate
    results.consolidated = await consolidationEngine.run(data);

    // Stage 2: Patterns
    results.patterns = await patternEngine.run(results.consolidated);

    // Stage 3: Insights
    results.insights = await insightEngine.run({ consolidated: results.consolidated, patterns: results.patterns });

    // Stage 4: Narrative
    results.narrative = await narrativeEngine.run({ patterns: results.patterns, insights: results.insights });

    const finalOutput = {
      themes: results.consolidated.themes.map(t => t.name),
      patterns: results.patterns.patterns,
      procrastination_signals: results.patterns.procrastination_signals,
      emotional_trends: results.patterns.emotional_trends,
      top_themes: results.insights.top_themes,
      growing_items: results.insights.growing_items,
      declining_items: results.insights.declining_items,
      critical_risk: results.insights.critical_risk,
      weekly_summary: results.narrative.weekly_summary,
      next_week_focus: results.narrative.next_week_focus
    };

    cache.set({ type: 'weekly', input: data }, finalOutput);

    const totalDuration = logger.timeEnd(startTime);
    logger.log('weekly-pipeline', 'Weekly intelligence successfully completed', totalDuration);

    return finalOutput;
  } catch (error) {
    logger.error('weekly-pipeline', `Weekly report generation failed: ${error.message}`);
    throw error;
  }
}

module.exports = { processWeekly };
