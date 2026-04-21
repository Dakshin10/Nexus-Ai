/**
 * Notes Service
 * Handles integration with Notion and Obsidian (Markdown).
 */
const { Client } = require("@notionhq/client");
const fs = require('fs');
const logger = require('../utils/logger');

class NotesService {
  constructor() {
    this.notion = new Client({ auth: process.env.NOTION_API_KEY });
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
