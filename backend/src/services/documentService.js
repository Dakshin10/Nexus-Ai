/**
 * Document Service
 * Handles ingestion and parsing of PDF, DOCX, and PPTX files.
 */
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const pptxParser = require('pptx-parser');
const logger = require('../utils/logger');

class DocumentService {
  /**
   * Main entry point for document parsing
   */
  async parseDocument(filePath, extension) {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMegabytes > 5) {
      throw new Error('File size exceeds the 5MB limit.');
    }

    let text = '';
    switch (extension.toLowerCase()) {
      case '.pdf':
        text = await this.parsePDF(filePath);
        break;
      case '.docx':
        text = await this.parseDOCX(filePath);
        break;
      case '.pptx':
        text = await this.parsePPTX(filePath);
        break;
      default:
        throw new Error('Unsupported document format.');
    }

    return this.processText(text, filePath);
  }

  async parsePDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  async parseDOCX(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  async parsePPTX(filePath) {
    // Note: pptx-parser usage can vary, but generally extracts text per slide
    const data = await pptxParser.parse(filePath);
    return data.map(slide => slide.text).join('\n');
  }

  /**
   * Process extracted text into actionable units
   */
  processText(text, originalName) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Heuristic extraction
    const headings = lines.filter(l => l.length < 100 && (l === l.toUpperCase() || /^[0-9]\./.test(l)));
    const tasks = lines.filter(l => l.toLowerCase().includes('task') || l.toLowerCase().includes('todo') || /^[•*-] \[ \]/.test(l));
    const keyPoints = lines.filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*')).slice(0, 10);
    const decisions = lines.filter(l => l.toLowerCase().includes('decided') || l.toLowerCase().includes('agreed'));

    return {
      document: {
        title: originalName.split('/').pop(),
        summary: text.substring(0, 300).replace(/\n/g, ' ') + '...',
        headings: headings.slice(0, 5),
        key_points: keyPoints,
        tasks: tasks.slice(0, 10),
        decisions: decisions.slice(0, 5)
      }
    };
  }
}

module.exports = new DocumentService();
