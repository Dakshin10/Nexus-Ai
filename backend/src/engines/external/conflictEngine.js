/**
 * Conflict Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/external/conflictPrompt');

async function run(input, context = {}) {
  return await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'external-conflict'
  });
}

module.exports = { run };
