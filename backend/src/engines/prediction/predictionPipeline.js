/**
 * Prediction Pipeline Orchestrator
 */
const contextEngine = require('./contextEngine');
const predictionEngine = require('./predictionEngine');
const interventionEngine = require('./interventionEngine');
const synthesisEngine = require('./synthesisEngine');
const logger = require('../../utils/logger');
const cache = require('../../utils/cache');

async function processPrediction(item, memory) {
  const startTime = logger.time();
  
  const cachedResult = cache.get({ type: 'prediction', item, memory });
  if (cachedResult) {
    logger.log('prediction-pipeline', 'Cache hit - skipping forecasting');
    return cachedResult;
  }

  const results = {};

  try {
    // Stage 1: Behavioral Context
    results.context = await contextEngine.run({ item, memory });

    // Stage 2: Forecast Probabilities
    results.prediction = await predictionEngine.run({ item, context: results.context });

    // Stage 3: Corrective Intervention
    results.intervention = await interventionEngine.run({ prediction: results.prediction });

    // Stage 4: Synthesis
    results.synthesis = await synthesisEngine.run({ prediction: results.prediction, intervention: results.intervention });

    const finalOutput = {
      item,
      completion_probability: results.prediction.completion_probability,
      impact: results.prediction.impact,
      difficulty: results.prediction.difficulty,
      risk_summary: results.synthesis.risk_summary,
      intervention: results.intervention.intervention,
      next_step: results.intervention.next_step
    };

    cache.set({ type: 'prediction', item, memory }, finalOutput);

    const totalDuration = logger.timeEnd(startTime);
    logger.log('prediction-pipeline', 'Behavioral forecasting successfully completed', totalDuration);

    return finalOutput;
  } catch (error) {
    logger.error('prediction-pipeline', `Forecasting failed: ${error.message}`);
    
    // Fallback: Safe, neutral prediction
    return {
      item,
      completion_probability: 50,
      impact: 'medium',
      difficulty: 'moderate',
      risk_summary: 'Insufficient data for precise forecast.',
      intervention: 'Continue monitoring behavioral patterns.',
      next_step: 'Start small to increase completion chance.',
      meta: { fallback: true }
    };
  }
}


module.exports = { processPrediction };
