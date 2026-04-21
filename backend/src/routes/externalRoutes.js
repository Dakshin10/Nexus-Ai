/**
 * External Routes
 */
const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const documentController = require('../controllers/documentController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/emails', externalController.handleGetEmails);
router.get('/oauth2callback', externalController.handleOAuth2Callback);
router.post('/process', externalController.handleProcess);
router.post('/analyze', externalController.handleAnalyzeBatch);

// Notes Integration
router.post('/notion/import', notesController.handleNotionImport);
router.post('/obsidian/upload', notesController.handleObsidianUpload);

// Document Integration
router.post('/document/upload', upload.single('document'), documentController.handleDocumentUpload);



module.exports = router;
