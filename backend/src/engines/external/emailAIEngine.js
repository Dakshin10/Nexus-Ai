/**
 * Email AI Engine
 * Intelligence layer for extracting actionable data from raw email streams.
 */
const { runAI } = require('../../services/aiService');

class EmailAIEngine {
  /**
   * Process a list of emails to extract actionable insights
   * @param {Array} emails 
   */
  async process(emails) {
    if (!emails || emails.length === 0) return [];

    try {
      // 1. Prepare batch prompt for AI
      // In a real production system, we'd process these in parallel or batch
      const processedResults = await Promise.all(
        emails.map(email => this.processSingleEmail(email))
      );

      // 2. Filter out nulls (informational/non-actionable)
      return processedResults.filter(result => result !== null);
    } catch (error) {
      console.error('[EmailAIEngine] Processing failed:', error.message);
      return [];
    }
  }

  /**
   * Process a single email using the AI service
   * @param {object} email 
   */
  async processSingleEmail(email) {
    const prompt = `
      You are an expert executive assistant. Analyze the following email and extract actionable items.
      
      RULES:
      1. If the email is purely informational (newsletters, receipts, greetings), return NULL.
      2. Detect intent: MEETING, REVIEW, ACTION, or INFO.
      3. Extract specific tasks and deadlines.
      4. Assign priority based on urgency and content.
      
      OUTPUT FORMAT:
      {
        "task": "Short descriptive task",
        "deadline": "ISO date or null",
        "priority": "high" | "medium" | "low",
        "intent": "MEETING" | "REVIEW" | "ACTION",
        "context": "Brief context from the email"
      }
    `;

    try {
      // Calling the AI service (currently mocked in aiService.js)
      const result = await runAI({
        stage: 'email-preprocessing',
        input: {
          subject: email.title,
          sender: email.author,
          content: email.body_preview
        },
        prompt
      });

      // If AI returns null or empty, skip it
      if (!result || Object.keys(result).length === 0) return null;

      return {
        ...result,
        source: 'gmail',
        original_id: email.nexus_id
      };
    } catch (error) {
      console.error(`[EmailAIEngine] Failed to process email ${email.nexus_id}:`, error.message);
      return null;
    }
  }
}

module.exports = new EmailAIEngine();
