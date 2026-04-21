/**
 * Action Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/external/actionPrompt');
const { validateExternal } = require('../../utils/externalValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'external-action'
  });

  validateExternal(result, 'action');
  return result;
}

module.exports = { run };
