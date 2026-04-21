/**
 * Decomposition Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/stream/decompositionPrompt');
const { validate } = require('../../utils/schemaValidator');

const schema = {
  required: ['atomic_thoughts'],
  properties: {
    atomic_thoughts: { type: 'array' }
  }
};

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    schema: schema,
    stage: 'decomposition'
  });

  validate(result, schema, 'decomposition');
  return result;
}

module.exports = { run };
