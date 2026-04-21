const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const parserService = require('../services/parserService');

// Configure Local Storage
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

/**
 * @route   POST /api/upload
 * @desc    Upload and parse file (PDF, MD, DOCX)
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const text = await parserService.parseFile(req.file);
    
    // Register for session intelligence
    parserService.addToRegistry(req.file.originalname, text);
    
    res.json({
      message: 'File processed and indexed for sync',
      filename: req.file.originalname,
      size: req.file.size,
      parsed_text: text,
      preview: text.substring(0, 500) + '...'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to process file', 
      details: error.message 
    });
  }
});

module.exports = router;
