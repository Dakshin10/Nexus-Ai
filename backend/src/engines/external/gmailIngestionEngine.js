/**
 * Gmail Ingestion Engine
 * Handles high-performance email fetching, intelligent filtering, and caching.
 */
const gmailService = require('../../services/gmailService');
const cacheService = require('../../utils/cacheService');

class GmailIngestionEngine {
  constructor() {
    this.SPAM_KEYWORDS = [
      'win', 'free', 'crypto', 'bonus', 'unsubscribe', 'no-reply', 'noreply',
      'offer', 'discount', 'sale', 'limited time', 'lottery'
    ];
    
    this.MARKETING_HEURISTICS = [
      '@mail.', '@news.', '@info.', '@marketing.', 'newsletter'
    ];
  }

  /**
   * Main ingestion loop
   * @param {object} options 
   */
  async ingest(options = { count: 10, userId: 'me' }) {
    const { count, userId } = options;
    const cacheKey = `gmail_ingest_${userId}`;

    // 1. Check Cache (Avoid duplicate fetch)
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      console.log('[GmailIngestion] Returning cached results');
      return cached;
    }

    try {
      // 2. Fetch raw emails with base query
      // Exclude promotions and social at API level
      const query = 'category:primary OR is:important -category:promotions -category:social';
      const rawEmails = await gmailService.fetchEmails(count * 2, query, userId);

      // 3. Intelligent Filtering & Normalization
      const processed = rawEmails
        .filter(email => this.isUseful(email))
        .map(email => this.normalize(email))
        .slice(0, count);

      // 4. Update Cache (TTL 5 minutes)
      await cacheService.set(cacheKey, processed, 300);

      return processed;
    } catch (error) {
      console.error('[GmailIngestion] Ingestion loop failed:', error.message);
      return [];
    }
  }

  /**
   * Phase 1 — Email Filtering Engine
   * Strict heuristic-based filtering to remove noise and keep only actionable emails.
   */
  isUseful(email) {
    const { subject, sender, snippet } = email;
    const text = (subject + snippet).toLowerCase();
    const from = sender.toLowerCase();

    const isJunk =
      text.includes("unsubscribe") ||
      text.includes("sale") ||
      text.includes("offer") ||
      from.includes("no-reply");

    const isActionable =
      /submit|complete|review|reply|attend|schedule|important|urgent|deadline/.test(text);

    return !isJunk && isActionable;
  }

  /**
   * Normalize into structured NEXUS format
   * @param {object} email 
   */
  normalize(email) {
    return {
      nexus_id: `email_${email.id}`,
      source: 'gmail',
      title: email.subject,
      author: email.sender,
      body_preview: email.snippet,
      timestamp: parseInt(email.timestamp),
      metadata: {
        raw_id: email.id,
        labels: email.labels,
        original_date: email.date
      },
      intelligence: {
        priority: this.calculatePriority(email),
        type: 'communication'
      }
    };
  }

  /**
   * Simple priority heuristic
   */
  calculatePriority(email) {
    const keywords = ['urgent', 'important', 'action', 'need', 'please', 'nexus'];
    const content = `${email.subject} ${email.snippet}`.toLowerCase();
    
    if (keywords.some(k => content.includes(k))) return 'high';
    return 'medium';
  }
}

module.exports = new GmailIngestionEngine();
