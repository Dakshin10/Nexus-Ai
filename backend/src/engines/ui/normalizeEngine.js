/**
 * Normalize Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/ui/normalizePrompt');
const { validateUI } = require('../../utils/uiValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'ui-normalization'
  });

  validateUI(result, 'normalization');
  return result;
}

module.exports = { run };
