/**
 * Insight Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/weekly/insightPrompt');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'weekly-insight'
  });
  return result;
}

module.exports = { run };
