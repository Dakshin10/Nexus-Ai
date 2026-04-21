/**
 * Memory Pipeline Orchestrator
 */
const extractionEngine = require('./extractionEngine');
const mergeEngine = require('./mergeEngine');
const patternEngine = require('./patternEngine');
const adaptationEngine = require('./adaptationEngine');
const logger = require('../../utils/logger');
const cache = require('../../utils/cache');

async function processMemory(currentData, pastMemory) {
  const startTime = logger.time();
  
  const cachedResult = cache.get({ type: 'memory', current: currentData, past: pastMemory });
  if (cachedResult) {
    logger.log('memory-pipeline', 'Cache hit - skipping memory processing');
    return cachedResult;
  }

  const results = {};

  try {
    // Stage 1: Extract meaningful items
    results.extracted = await extractionEngine.run(currentData);

    // Stage 2: Merge with past memory
    results.merged = await mergeEngine.run(results.extracted.extracted_memory, { pastMemory: pastMemory.memory_items });

    // Stage 3: Detect patterns
    results.patterns = await patternEngine.run(results.merged.memory_items);

    // Stage 4: Generate adaptive insights
    results.adaptation = await adaptationEngine.run({ memory: results.merged.memory_items, patterns: results.patterns.patterns });

    const finalOutput = {
      memory_items: results.merged.memory_items,
      patterns: results.patterns.patterns,
      risk_prediction: results.adaptation.risk_prediction,
      behavioral_suggestion: results.adaptation.behavioral_suggestion
    };

    cache.set({ type: 'memory', current: currentData, past: pastMemory }, finalOutput);

    const totalDuration = logger.timeEnd(startTime);
    logger.log('memory-pipeline', 'Memory processing successfully completed', totalDuration);

    return finalOutput;
  } catch (error) {
    logger.error('memory-pipeline', `Memory processing failed: ${error.message}`);
    throw error;
  }
}

module.exports = { processMemory };
