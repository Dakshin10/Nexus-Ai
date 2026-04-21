/**
 * Classification Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/stream/classificationPrompt');
const { validate } = require('../../utils/schemaValidator');

const schema = {
  required: ['classified'],
  properties: {
    classified: { type: 'array' }
  }
};

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    schema: schema,
    stage: 'classification'
  });

  validate(result, schema, 'classification');
  return result;
}

module.exports = { run };
