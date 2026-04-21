/**
 * Narrative Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/weekly/narrativePrompt');
const { validateWeekly } = require('../../utils/weeklyValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'weekly-narrative'
  });

  validateWeekly(result, 'narrative');
  return result;
}

module.exports = { run };
