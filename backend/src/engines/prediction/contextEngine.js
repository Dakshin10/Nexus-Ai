/**
 * Context Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/prediction/contextPrompt');
const { validatePrediction } = require('../../utils/predictionValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: { item: input.item, memory: input.memory },
    stage: 'prediction-context'
  });

  validatePrediction(result, 'context');
  return result;
}

module.exports = { run };
