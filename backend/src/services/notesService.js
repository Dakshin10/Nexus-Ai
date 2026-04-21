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
    this.tokenStore = require('../utils/tokenStore');
  }

  /**
   * Helper to initialize Notion client for a specific user
   */
  async getClientForUser(userId) {
    if (!userId) throw new Error('userId is required for Notion operations');
    
    // Fallback to environment key if specified (e.g. for system operations)
    if (userId === 'system' && process.env.NOTION_API_KEY) {
      return new Client({ auth: process.env.NOTION_API_KEY });
    }

    const tokens = await this.tokenStore.getTokens(userId, 'notion');
    if (!tokens || !tokens.access_token) {
      throw new Error(`No Notion integration found for user: ${userId}`);
    }

    return new Client({ auth: tokens.access_token });
  }

  /**
   * Validate Connection on Startup
   */
  async validateConnection(userId = 'system') {
    try {
      const notion = await this.getClientForUser(userId);
      await notion.users.me({});
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
  async createTaskPage(data, userId, attempt = 1) {
    const { task, priority, source, context } = data;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      console.error('[NotionService] NOTION_DATABASE_ID is missing.');
      return null;
    }

    const notion = await this.getClientForUser(userId);

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
      const existing = await notion.databases.query({
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
      const response = await notion.pages.create({
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
   * List Searchable Pages from Notion
   * Uses search API and caches results.
   */
  async listPages(userId) {
    const cacheKey = `notion_pages_search_${userId}`;
    
    try {
      const notion = await this.getClientForUser(userId);
      // 1. Check Cache
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        logger.log('notes-service', 'Returning cached Notion pages list.');
        return cached;
      }

      // 2. Search Notion
      const response = await notion.search({
        filter: { property: 'object', value: 'page' },
        sort: { direction: 'descending', timestamp: 'last_edited_time' },
        page_size: 15
      });

      const pages = response.results.map(page => {
        const titleProp = page.properties.title || Object.values(page.properties).find(p => p.type === 'title');
        const title = titleProp?.title[0]?.plain_text || 'Untitled Page';
        
        return {
          id: page.id,
          title,
          lastEdited: page.last_edited_time,
          url: page.url,
          preview: `Notion page created/updated at ${new Date(page.last_edited_time).toLocaleString()}`
        };
      });

      // 3. Cache for 10 minutes
      await cacheService.set(cacheKey, pages, 600);
      
      return pages;
    } catch (error) {
      logger.error('notes-service', `Notion List Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch Notion Page & Extract Content
   */
  async fetchNotionPage(pageId, userId) {
    try {
      const notion = await this.getClientForUser(userId);
      const response = await notion.pages.retrieve({ page_id: pageId });
      
      // Recursive block extraction
      const content = await this.extractBlocks(pageId, notion);
      
      // Title extraction
      const titleProp = response.properties.title || Object.values(response.properties).find(p => p.type === 'title');
      const title = titleProp?.title[0]?.plain_text || 'Untitled Notion Page';

      return {
        id: pageId,
        title,
        content,
        source: 'notion'
      };
    } catch (error) {
      logger.error('notes-service', `Notion Extraction Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Recursive Block Extractor
   */
  async extractBlocks(blockId, notion) {
    try {
      const blocks = await notion.blocks.children.list({ block_id: blockId });
      let text = '';

      for (const block of blocks.results) {
        const type = block.type;
        if (block[type]?.rich_text) {
          text += block[type].rich_text.map(t => t.plain_text).join('') + '\n';
        }
        
        // Handle children (nested blocks)
        if (block.has_children) {
          const childText = await this.extractBlocks(block.id, notion);
          text += childText;
        }
      }
      return text;
    } catch (e) {
      logger.error('notes-service', `Block extraction failed for ${blockId}: ${e.message}`);
      return '';
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
      summary: note.content.substring(0, 300) + '...',
      content: note.content,
      tasks,
      ideas,
      decisions,
      source: note.source
    };
  }
}

module.exports = new NotesService();
