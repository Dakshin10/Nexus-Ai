/**
 * Schema Validator Utility
 * Enforces strict structure, types, and field presence for engine outputs.
 */
const logger = require('./logger');

const validate = (data, schema, stage) => {
  const errors = [];

  // Check required fields
  if (schema.required) {
    schema.required.forEach(field => {
      if (data[field] === undefined || data[field] === null) {
        errors.push(`Missing required field: '${field}'`);
      }
    });
  }

  // Type validation
  if (schema.properties) {
    Object.keys(schema.properties).forEach(key => {
      if (data[key] !== undefined) {
        const expectedType = schema.properties[key].type;
        const actualType = Array.isArray(data[key]) ? 'array' : typeof data[key];
        
        if (expectedType === 'array' && actualType !== 'array') {
          errors.push(`Field '${key}' expected type 'array', got '${actualType}'`);
        } else if (expectedType !== 'array' && actualType !== expectedType) {
          errors.push(`Field '${key}' expected type '${expectedType}', got '${actualType}'`);
        }
      }
    });
  }

  if (errors.length > 0) {
    logger.error(stage, `Validation failed: ${errors.join(', ')}`);
    throw new Error(`Schema validation error in ${stage}: ${errors.join('; ')}`);
  }

  return true;
};

module.exports = { validate };
