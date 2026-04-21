/**
 * Extraction Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/memory/extractionPrompt');
const { validateMemory } = require('../../utils/memoryValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'memory-extraction'
  });

  validateMemory(result, 'extraction');
  return result;
}

module.exports = { run };
