/**
 * Type information utility for handling different field types
 * Used for validation, formatting, and UI rendering
 */

export const TypeInfo = {
  // Text types
  Text: {
    type: 'string',
    defaultValue: '',
    validate: (value) => typeof value === 'string',
    format: (value) => value || '',
    inputType: 'text'
  },
  MultilineText: {
    type: 'string',
    defaultValue: '',
    validate: (value) => typeof value === 'string',
    format: (value) => value || '',
    inputType: 'textarea'
  },
  Email: {
    type: 'string',
    defaultValue: '',
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    format: (value) => value || '',
    inputType: 'email'
  },
  Website: {
    type: 'string',
    defaultValue: '',
    validate: (value) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/.test(value),
    format: (value) => value || '',
    inputType: 'url'
  },
  Phone: {
    type: 'string',
    defaultValue: '',
    validate: (value) => /^[0-9+\-() ]+$/.test(value),
    format: (value) => value || '',
    inputType: 'tel'
  },

  // Numeric types
  Number: {
    type: 'number',
    defaultValue: 0,
    validate: (value) => !isNaN(parseInt(value)),
    format: (value) => parseInt(value) || 0,
    inputType: 'number'
  },
  Decimal: {
    type: 'number',
    defaultValue: 0.0,
    validate: (value) => !isNaN(parseFloat(value)),
    format: (value) => parseFloat(value) || 0.0,
    inputType: 'number',
    step: '0.01'
  },
  Currency: {
    type: 'number',
    defaultValue: 0.0,
    validate: (value) => !isNaN(parseFloat(value)),
    format: (value) => parseFloat(value) || 0.0,
    inputType: 'number',
    step: '0.01'
  },
  Rating: {
    type: 'number',
    defaultValue: 0,
    validate: (value) => !isNaN(parseInt(value)),
    format: (value) => parseInt(value) || 0,
    inputType: 'number',
    min: 0,
    max: 5
  },

  // Date types
  Date: {
    type: 'date',
    defaultValue: '',
    validate: (value) => !isNaN(Date.parse(value)),
    format: (value) => value ? new Date(value).toISOString().split('T')[0] : '',
    inputType: 'date'
  },
  DateTime: {
    type: 'datetime',
    defaultValue: '',
    validate: (value) => !isNaN(Date.parse(value)),
    format: (value) => value ? new Date(value).toISOString() : '',
    inputType: 'datetime-local'
  },

  // Selection types
  Picklist: {
    type: 'string',
    defaultValue: '',
    validate: (value, options) => options.includes(value),
    format: (value) => value || '',
    inputType: 'select'
  },
  Tag: {
    type: 'array',
    defaultValue: [],
    validate: (value) => Array.isArray(value),
    format: (value) => Array.isArray(value) ? value : value ? value.split(',') : [],
    inputType: 'tags'
  },
  Boolean: {
    type: 'boolean',
    defaultValue: false,
    validate: (value) => typeof value === 'boolean',
    format: (value) => Boolean(value),
    inputType: 'checkbox'
  }
};

export default TypeInfo;