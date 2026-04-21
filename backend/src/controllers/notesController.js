const notesService = require('../services/notesService');
const notionAIEngine = require('../engines/external/notionAIEngine');
const logger = require('../utils/logger');

exports.handleNotionConnect = async (req, res) => {
  const { userId } = req.query;
  try {
    const isValid = await notesService.validateConnection(userId || 'system');
    if (isValid) {
      res.json({ connected: true, message: 'Notion integration ready.' });
    } else {
      res.status(401).json({ connected: false, error: 'Invalid Notion API Key' });
    }
  } catch (error) {
    logger.error('notes-controller', `Connect Error: ${error.message}`);
    res.status(500).json({ error: 'Notion connection failed' });
  }
};

exports.handleListPages = async (req, res) => {
  const { userId } = req.query;
  try {
    const pages = await notesService.listPages(userId);
    res.json(pages);
  } catch (error) {
    logger.error('notes-controller', `List Pages Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to list Notion pages' });
  }
};

exports.handleNotionImport = async (req, res) => {
  const { page_id, userId } = req.body;
  if (!page_id) return res.status(400).json({ error: 'page_id is required' });

  try {
    // 1. Fetch full content
    const page = await notesService.fetchNotionPage(page_id, userId);
    
    // 2. Extract tasks using AI
    const tasks = await notionAIEngine.process(page);
    
    res.json({
      success: true,
      page_title: page.title,
      tasks: tasks
    });
  } catch (error) {
    logger.error('notes-controller', `Import Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to import Notion page' });
  }
};


exports.handleObsidianUpload = async (req, res) => {
  // Assuming file is uploaded and path is provided
  const { file_path } = req.body; 
  if (!file_path) return res.status(400).json({ error: 'file_path is required' });

  try {
    const note = await notesService.parseMarkdown(file_path);
    const result = notesService.processNote(note);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse Obsidian file' });
  }
};

