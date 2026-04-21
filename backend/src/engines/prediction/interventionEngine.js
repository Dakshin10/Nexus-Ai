/**
 * Intervention Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/prediction/interventionPrompt');
const { validatePrediction } = require('../../utils/predictionValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'prediction-intervention'
  });

  validatePrediction(result, 'intervention');
  return result;
}

module.exports = { run };
