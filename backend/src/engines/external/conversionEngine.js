/**
 * Conversion Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/external/conversionPrompt');
const { validateExternal } = require('../../utils/externalValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'external-conversion'
  });

  validateExternal(result, 'conversion');
  return result;
}

module.exports = { run };
