/**
 * Pattern Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/memory/patternPrompt');
const { validateMemory } = require('../../utils/memoryValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'memory-pattern'
  });

  validateMemory(result, 'pattern');
  return result;
}

module.exports = { run };
