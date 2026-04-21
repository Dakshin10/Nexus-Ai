/**
 * Cognitive Load Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/stream/loadPrompt');
const { validate } = require('../../utils/schemaValidator');

const schema = {
  required: ['cognitive_load'],
  properties: {
    cognitive_load: { type: 'object' }
  }
};

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    schema: schema,
    stage: 'load'
  });

  validate(result, schema, 'load');
  return result;
}

module.exports = { run };
