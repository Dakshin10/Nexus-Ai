/**
 * AI Service
 * Core bridge to OpenAI with real extraction logic and Anti-Gravity prompting.
 */
const OpenAI = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generic AI execution wrapper
 */
async function runAI({ prompt, input, systemPrompt = 'You are a cognitive AI assistant.', stage = 'ai-service' }) {
  const startTime = logger.time();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${prompt}\n\nInput Data: ${JSON.stringify(input)}` }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    const duration = logger.timeEnd(startTime);
    logger.log(stage, `AI processing completed in ${duration}ms`);
    return result;
  } catch (error) {
    logger.error(stage, `AI processing failed: ${error.message}`);
    throw error;
  }
}

/**
 * ⚡ PHASE 2 — AI UNDERSTANDING ENGINE
 * Specialized logic for converting filtered emails into actionable tasks.
 */
async function extractTasksFromEmails(emails) {
  if (!emails || emails.length === 0) return [];

  const systemPrompt = `
    You are a productivity intelligence system.
    Convert emails into actionable tasks using the provided JSON format.
    
    RULES:
    - Ignore noise
    - Extract clear actions
    - Infer urgency (DO_NOW, DO_NEXT, LATER)
    - Max 5 tasks total
    
    Output format:
    [
      {
        "task": "Title of the task",
        "priority": "DO_NOW | DO_NEXT | LATER",
        "reasoning": "Brief explanation of why"
      }
    ]
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Emails: ${JSON.stringify(emails)}` }
      ],
      // We'll use the default format but ensure it's a valid JSON array string
    });

    const result = JSON.parse(response.choices[0].message.content);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    logger.error('ai-understanding', `Task extraction failed: ${error.message}`);
    return [];
  }
}

module.exports = { 
  runAI,
  extractTasksFromEmails
};
