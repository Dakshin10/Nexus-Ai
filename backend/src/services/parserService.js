const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

class ParserService {
  /**
   * Parse uploaded file based on mimetype
   */
  async parseFile(file) {
    const { path, mimetype, originalname } = file;

    try {
      if (mimetype === 'application/pdf') {
        return await this.parsePDF(path);
      } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return await this.parseDOCX(path);
      } else if (mimetype === 'text/markdown' || mimetype === 'text/plain' || originalname.endsWith('.md')) {
        return await this.parseMarkdown(path);
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error(`[ParserService] Error parsing ${originalname}:`, error.message);
      throw error;
    }
  }

  async parsePDF(path) {
    const dataBuffer = fs.readFileSync(path);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  async parseDOCX(path) {
    const result = await mammoth.extractRawText({ path });
    return result.value;
  }

  async parseMarkdown(path) {
    return fs.readFileSync(path, 'utf-8');
  }
}

module.exports = new ParserService();
