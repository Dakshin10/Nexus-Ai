/**
 * Stream Pipeline Orchestrator
 * Sequentially executes cognitive engines and aggregates the results.
 */
const decompositionEngine = require('./decompositionEngine');
const classificationEngine = require('./classificationEngine');
const reasoningEngine = require('./reasoningEngine');
const cognitiveLoadEngine = require('./cognitiveLoadEngine');
const { validateStreamInput } = require('../../utils/streamValidator');
const logger = require('../../utils/logger');
const cache = require('../../utils/cache');

async function processStream(rawInput) {
  const startTime = logger.time();

  try {
    // 1. Production Validation
    validateStreamInput(rawInput);

    // 2. Deduplication check via cache
    const cachedResult = cache.get({ type: 'stream', input: rawInput });
    if (cachedResult) {
      logger.log('pipeline', 'Cache hit - skipping processing');
      return cachedResult;
    }

    const results = {};

    // Stage 1: Decomposition
    results.decomposition = await decompositionEngine.run(rawInput);

    // Stage 2: Classification
    results.classification = await classificationEngine.run(results.decomposition);

    // Stage 3: Reasoning
    results.reasoning = await reasoningEngine.run(results.classification);

    // Stage 4: Cognitive Load
    results.load = await cognitiveLoadEngine.run(results.classification);

    // 3. Final Merging
    const finalOutput = mergeResults(results);

    // 4. Cache the final result
    cache.set({ type: 'stream', input: rawInput }, finalOutput);

    const totalDuration = logger.timeEnd(startTime);
    logger.log('pipeline', 'Full pipeline successfully completed', totalDuration);

    return finalOutput;
  } catch (error) {
    logger.error('pipeline', `Production Pipeline Failure: ${error.message}`);
    
    // 5. Fallback Response (Reliability Requirement)
    return {
      summary: "System processing failed, providing a basic summary.",
      tasks: [rawInput.substring(0, 50) + "..."],
      ideas: [],
      questions: [],
      emotions: [],
      decisions: [],
      urgent: [],
      top_priority: "N/A",
      recommended_action: "Review original input manually.",
      cognitive_load: { score: 0, status: 'gray' },
      meta: {
        error: true,
        message: error.message
      }
    };
  }
}


function mergeResults(results) {
  const classified = results.classification.classified || [];
  
  const byType = (type) => classified.filter(c => c.type === type).map(c => c.text);

  return {
    summary: results.reasoning.summary,
    tasks: byType('task'),
    ideas: byType('idea'),
    questions: byType('question'),
    emotions: byType('emotion'),
    decisions: byType('decision'),
    urgent: results.reasoning.urgent,
    top_priority: results.reasoning.top_priority,
    recommended_action: results.reasoning.recommended_action,
    cognitive_load: results.load.cognitive_load
  };
}

module.exports = { processStream };
