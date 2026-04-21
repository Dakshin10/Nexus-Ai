/**
 * Prediction Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/prediction/predictionPrompt');
const { validatePrediction } = require('../../utils/predictionValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'prediction-prob'
  });

  validatePrediction(result, 'prediction');
  return result;
}

module.exports = { run };
