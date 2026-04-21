/**
 * Temporal Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/external/temporalPrompt');

async function run(input, context = {}) {
  return await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'external-temporal'
  });
}

module.exports = { run };
