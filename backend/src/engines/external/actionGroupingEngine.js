/**
 * Action Grouping Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/external/actionGroupingPrompt');

async function run(input, context = {}) {
  return await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'external-grouping'
  });
}

module.exports = { run };
