/**
 * Prioritization Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/external/prioritizationPrompt');

async function run(input, context = {}) {
  return await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'external-priority'
  });
}

module.exports = { run };
