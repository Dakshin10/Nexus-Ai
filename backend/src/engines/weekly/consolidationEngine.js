/**
 * Consolidation Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/weekly/consolidationPrompt');
const { validateWeekly } = require('../../utils/weeklyValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'weekly-consolidation'
  });

  validateWeekly(result, 'consolidation');
  return result;
}

module.exports = { run };
