/**
 * Transform Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/ui/transformPrompt');
const { validateUI } = require('../../utils/uiValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'ui-transformation'
  });

  validateUI(result, 'transformation');
  return result;
}

module.exports = { run };
