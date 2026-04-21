/**
 * Attention Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/ui/attentionPrompt');
const { validateUI } = require('../../utils/uiValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'ui-attention'
  });

  validateUI(result, 'attention');
  return result;
}

module.exports = { run };
