/**
 * Notes Controller
 */
const notesService = require('../services/notesService');
const logger = require('../utils/logger');

exports.handleNotionImport = async (req, res) => {
  const { page_id } = req.body;
  if (!page_id) return res.status(400).json({ error: 'page_id is required' });

  try {
    const page = await notesService.fetchNotionPage(page_id);
    const result = notesService.processNote(page);
    res.json(result);
  } catch (error) {
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
