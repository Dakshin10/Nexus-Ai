/**
 * Document AI Engine
 * Specialized extraction of actionable tasks from long-form documents.
 */
const { runAI } = require('../../services/aiService');

class DocumentAIEngine {
  constructor() {
    this.SYSTEM_PROMPT = `You are a productivity intelligence engine.
Your task is to extract actionable items from the provided document text.

Rules:
- Focus on explicit tasks, assignments, and deadlines.
- Ignore historical context or non-actionable background info.
- Infer priority (DO_NOW, DO_NEXT, LATER).
- Summarize clearly.

Output format: JSON array of objects.`;
  }

  async process(text, metadata = {}) {
    if (!text || text.length < 50) return [];

    try {
      const response = await runAI({
        prompt: this.SYSTEM_PROMPT,
        input: text,
        stage: 'document-extraction'
      });

      return (response.tasks || []).map(task => ({
        ...task,
        source: 'document',
        context: metadata.filename || 'Uploaded Document',
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('[DocumentAIEngine] Extraction failed:', error.message);
      return [];
    }
  }
}

module.exports = new DocumentAIEngine();
