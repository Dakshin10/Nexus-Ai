/**
 * Intent Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/orchestrator/intentPrompt');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'orchestrator-intent'
  });
  return result;
}

module.exports = { run };
