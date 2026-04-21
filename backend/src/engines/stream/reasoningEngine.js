/**
 * Reasoning Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/stream/reasoningPrompt');
const { validate } = require('../../utils/schemaValidator');

const schema = {
  required: ['summary', 'urgent', 'top_priority', 'recommended_action'],
  properties: {
    summary: { type: 'string' },
    urgent: { type: 'array' },
    top_priority: { type: 'string' },
    recommended_action: { type: 'string' }
  }
};

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    schema: schema,
    stage: 'reasoning'
  });

  validate(result, schema, 'reasoning');
  return result;
}

module.exports = { run };
