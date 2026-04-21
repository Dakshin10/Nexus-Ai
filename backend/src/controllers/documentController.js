/**
 * Document Controller
 */
const documentService = require('../services/documentService');
const logger = require('../utils/logger');
const path = require('path');

exports.handleDocumentUpload = async (req, res) => {
  // Assuming file is uploaded via multer or similar and available at req.file
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filePath = req.file.path;
  const extension = path.extname(req.file.originalname);

  try {
    const result = await documentService.parseDocument(filePath, extension);
    res.json(result);
  } catch (error) {
    logger.error('document-controller', `Document Upload Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
