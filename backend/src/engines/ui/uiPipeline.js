/**
 * UI Intelligence Pipeline
 */
const normalizeEngine = require('./normalizeEngine');
const attentionEngine = require('./attentionEngine');
const transformEngine = require('./transformEngine');
const stateEngine = require('./stateEngine');
const logger = require('../../utils/logger');
const cache = require('../../utils/cache');

async function processUI(cognitiveOutput) {
  const startTime = logger.time();
  
  const cachedResult = cache.get({ type: 'ui', input: cognitiveOutput });
  if (cachedResult) {
    logger.log('ui-pipeline', 'Cache hit - skipping UI processing');
    return cachedResult;
  }

  const results = {};

  try {
    // Stage 1: Normalize
    results.normalized = await normalizeEngine.run(cognitiveOutput);

    // Stage 2: Attention
    results.attention = await attentionEngine.run(results.normalized);

    // Stage 3: Transform
    results.transformed = await transformEngine.run(results.normalized);

    // Stage 4: State
    results.state = await stateEngine.run(results.normalized.cognitive_load);

    // Final Assembly
    const finalOutput = {
      ordered_sections: results.attention.ordered_sections,
      highlight_items: results.attention.highlight_items,
      sections: results.transformed.sections,
      ui_state: results.state
    };

    // Payload Optimization: Remove empty sections and limit items
    finalOutput.sections = finalOutput.sections
      .filter(s => s.items.length > 0 || s.empty_state)
      .map(s => ({ ...s, items: s.items.slice(0, 5) }));

    cache.set({ type: 'ui', input: cognitiveOutput }, finalOutput);

    const totalDuration = logger.timeEnd(startTime);
    logger.log('ui-pipeline', 'UI intelligence successfully completed', totalDuration);

    return finalOutput;
  } catch (error) {
    logger.error('ui-pipeline', `UI processing failed: ${error.message}`);
    throw error;
  }
}

module.exports = { processUI };
