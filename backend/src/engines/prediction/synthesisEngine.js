/**
 * Synthesis Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/prediction/synthesisPrompt');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'prediction-synthesis'
  });
  return result;
}

module.exports = { run };
