/**
 * Extraction Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/external/extractionPrompt');
const { validateExternal } = require('../../utils/externalValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input.content,
    stage: 'external-extraction'
  });

  validateExternal(result, 'extraction');
  return result;
}

module.exports = { run };
