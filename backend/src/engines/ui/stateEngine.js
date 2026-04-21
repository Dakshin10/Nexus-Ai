/**
 * State Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/ui/statePrompt');
const { validateUI } = require('../../utils/uiValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'ui-state'
  });

  validateUI(result, 'state');
  return result;
}

module.exports = { run };
