/**
 * Notes Service
 * Handles integration with Notion and Obsidian (Markdown).
 */
const { Client } = require("@notionhq/client");
const fs = require('fs');
const crypto = require('crypto');
const logger = require('../utils/logger');
const cacheService = require('../utils/cacheService');

class NotesService {
  constructor() {
    this.notion = new Client({ auth: process.env.NOTION_API_KEY });
  }

  /**
   * Validate Connection on Startup
   */
  async validateConnection() {
    try {
      await this.notion.users.me({});
      console.log('[NotionService] Connection validated successfully.');
      return true;
    } catch (error) {
      console.error('[NotionService] Connection validation failed:', error.message);
      return false;
    }
  }

  /**
   * Create Notion Page from Structured Task
   * @param {object} data { task, priority, source, context }
   */
  async createTaskPage(data, attempt = 1) {
    const { task, priority, source, context } = data;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      console.error('[NotionService] NOTION_DATABASE_ID is missing.');
      return null;
    }

    // 1. Generate unique hash for idempotency (email_subject + sender/source)
    const hash = crypto.createHash('md5')
      .update(`${task}_${source}`)
      .digest('hex');
    
    const cacheKey = `notion_task_${hash}`;

    try {
      // 2. Check Cache first (Avoid duplicate fetch/create)
      const isDuplicate = await cacheService.get(cacheKey);
      if (isDuplicate) {
        console.log(`[NotionService] Task already synced recently (hash: ${hash}). Skipping.`);
        return { cached: true, hash };
      }

      // 3. Optional: Database query as secondary check
      const existing = await this.notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Name',
          title: { equals: task }
        }
      });

      if (existing.results.length > 0) {
        console.log(`[NotionService] Task "${task}" already exists in Notion. Skipping.`);
        await cacheService.set(cacheKey, true, 604800); // Cache for 7 days
        return existing.results[0];
      }

      // 4. Create Page
      const response = await this.notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          'Name': { title: [{ text: { content: task } }] },
          'Priority': { select: { name: priority || 'medium' } },
          'Source': { rich_text: [{ text: { content: source || 'nexus' } }] },
          'Context': { rich_text: [{ text: { content: context || '' } }] }
        }
      });

      // 5. Store in Cache on success (7-day expiry)
      await cacheService.set(cacheKey, true, 604800); 
      
      console.log(`[NotionService] Created page for task: ${task}`);
      return response;
    } catch (error) {
      console.error(`[NotionService] Create Page Error (Attempt ${attempt}):`, error.message);
      
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.createTaskPage(data, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Fetch Notion Page
   */
  async fetchNotionPage(pageId) {
    try {
      const response = await this.notion.pages.retrieve({ page_id: pageId });
      const blocks = await this.notion.blocks.children.list({ block_id: pageId });
      
      const textContent = blocks.results
        .filter(b => b.type === 'paragraph' || b.type === 'heading_1' || b.type === 'heading_2' || b.type === 'heading_3')
        .map(b => {
          const type = b.type;
          return b[type].rich_text.map(t => t.plain_text).join('');
        }).join('\n');

      return {
        title: response.properties.title?.title[0]?.plain_text || 'Untitled Notion Page',
        content: textContent,
        source: 'notion'
      };
    } catch (error) {
      logger.error('notes-service', `Notion Fetch Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Parse Obsidian / Markdown
   */
  async parseMarkdown(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      const title = lines[0].startsWith('# ') ? lines[0].replace('# ', '') : 'Untitled Obsidian Note';
      const tasks = lines.filter(l => l.includes('- [ ]') || l.includes('- [x]'))
        .map(l => l.replace('- [ ]', '').replace('- [x]', '').trim());
      
      const ideas = lines.filter(l => l.startsWith('- ') && !l.includes('[ ]') && !l.includes('[x]'))
        .map(l => l.replace('- ', '').trim());

      return {
        title,
        content,
        tasks,
        ideas,
        source: 'obsidian'
      };
    } catch (error) {
      logger.error('notes-service', `Markdown Parse Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Convert Notes to Cognitive Units
   */
  processNote(note) {
    // Basic structural extraction
    const tasks = note.tasks || [];
    const ideas = note.ideas || [];
    
    // Heuristic: Short lines with '?' are decisions
    const decisions = note.content.split('\n')
      .filter(l => l.length < 100 && l.includes('?'))
      .map(l => l.trim());

    return {
      title: note.title,
      summary: note.content.substring(0, 200) + '...',
      tasks,
      ideas,
      decisions,
      source: note.source
    };
  }
}

module.exports = new NotesService();
