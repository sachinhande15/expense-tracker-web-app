/**
 * Error parsing utilities for authentication components
 * Maps backend error messages to user-friendly messages and categorizes errors
 */

// Error message mappings for common backend errors
const ERROR_MAPPINGS = {
  // Authentication errors
  'Invalid credentials': 'Invalid email or password. Please check and try again.',
  'User not found': 'No account found with this email address.',
  'Invalid password': 'The password you entered is incorrect.',
  'Account is disabled': 'This account has been disabled. Please contact support.',
  'Account is locked': 'This account is temporarily locked. Please try again later.',

  // Registration errors
  'Username is already taken': 'This username is already taken. Please choose a different one.',
  'Email is already registered': 'An account with this email already exists. Try signing in instead.',
  'Username already exists': 'This username is already taken. Please choose a different one.',
  'Email already exists': 'An account with this email already exists. Try signing in instead.',

  // Validation errors
  'Username must be between 3 and 50 characters': 'Username must be 3-50 characters long.',
  'Password must be at least 6 characters': 'Password must be at least 6 characters long.',
  'Invalid email format': 'Please enter a valid email address.',
  'Email is required': 'Email address is required.',
  'Username is required': 'Username is required.',
  'Password is required': 'Password is required.',

  // Server errors
  'Internal server error': 'Something went wrong on our end. Please try again later.',
  'Service unavailable': 'Service is temporarily unavailable. Please try again later.',
  'Database connection error': 'Unable to connect to our servers. Please try again later.',

  // Network errors
  'Network error': 'Please check your internet connection and try again.',
  'Request timeout': 'Request timed out. Please try again.',
  'Connection refused': 'Unable to connect to our servers. Please try again later.'
};

/**
 * Categorizes error types for different handling
 */
const ERROR_CATEGORIES = {
  AUTHENTICATION: 'authentication',
  VALIDATION: 'validation',
  SERVER: 'server',
  NETWORK: 'network',
  FIELD: 'field'
};

/**
 * Parses backend error response and returns user-friendly message
 * @param {Object|string} error - Error object or string from backend
 * @param {string} defaultMessage - Default message if no mapping found
 * @returns {Object} - Parsed error object with message and category
 */
export const parseErrorMessage = (error, defaultMessage = 'An unexpected error occurred. Please try again.') => {
  let errorMessage = '';
  let errorCategory = ERROR_CATEGORIES.SERVER;

  // Handle string errors
  if (typeof error === 'string') {
    errorMessage = error;
  }
  // Handle error objects
  else if (error && typeof error === 'object') {
    // Check for error message in different possible locations
    errorMessage = error.message ||
                   error.error ||
                   error.errorMessage ||
                   error.detail ||
                   error.description ||
                   '';

    // Handle nested error structures
    if (error.response?.data) {
      const responseData = error.response.data;
      if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      }
    }
  }

  // Clean up the error message
  errorMessage = errorMessage.trim();

  // Map to user-friendly message
  const friendlyMessage = ERROR_MAPPINGS[errorMessage] || errorMessage || defaultMessage;

  // Categorize the error
  errorCategory = categorizeError(errorMessage);

  return {
    message: friendlyMessage,
    category: errorCategory,
    originalMessage: errorMessage
  };
};

/**
 * Categorizes error based on message content
 * @param {string} errorMessage - The error message to categorize
 * @returns {string} - Error category
 */
export const categorizeError = (errorMessage) => {
  if (!errorMessage) return ERROR_CATEGORIES.SERVER;

  const message = errorMessage.toLowerCase();

  if (message.includes('username') && (message.includes('taken') || message.includes('exists'))) {
    return ERROR_CATEGORIES.FIELD;
  }

  if (message.includes('email') && (message.includes('exists') || message.includes('registered'))) {
    return ERROR_CATEGORIES.FIELD;
  }

  if (message.includes('password') || message.includes('credentials') || message.includes('invalid')) {
    return ERROR_CATEGORIES.AUTHENTICATION;
  }

  if (message.includes('required') || message.includes('format') || message.includes('validation')) {
    return ERROR_CATEGORIES.VALIDATION;
  }

  if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
    return ERROR_CATEGORIES.NETWORK;
  }

  if (message.includes('server') || message.includes('internal') || message.includes('database')) {
    return ERROR_CATEGORIES.SERVER;
  }

  return ERROR_CATEGORIES.SERVER;
};

/**
 * Creates field-specific error messages
 * @param {string} fieldName - Name of the field with error
 * @param {string} errorMessage - Original error message
 * @returns {string} - Field-specific error message
 */
export const getFieldErrorMessage = (fieldName, errorMessage) => {
  const fieldMappings = {
    username: {
      'Username is already taken': 'This username is already taken. Please choose a different one.',
      'Username must be between 3 and 50 characters': 'Username must be 3-50 characters long.',
      'Username is required': 'Username is required.'
    },
    email: {
      'Email is already registered': 'An account with this email already exists. Try signing in instead.',
      'Invalid email format': 'Please enter a valid email address.',
      'Email is required': 'Email address is required.'
    },
    password: {
      'Password must be at least 6 characters': 'Password must be at least 6 characters long.',
      'Password is required': 'Password is required.',
      'Invalid password': 'The password you entered is incorrect.'
    },
    confirmPassword: {
      'Passwords do not match': 'Passwords do not match.',
      'Password confirmation is required': 'Please confirm your password.'
    }
  };

  return fieldMappings[fieldName]?.[errorMessage] || errorMessage;
};

/**
 * Validates field values and returns appropriate error messages
 * @param {string} fieldName - Name of the field to validate
 * @param {string} value - Value to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (fieldName, value) => {
  if (!value || !value.trim()) {
    switch (fieldName) {
      case 'username': return 'Username is required.';
      case 'email': return 'Email address is required.';
      case 'password': return 'Password is required.';
      case 'confirmPassword': return 'Please confirm your password.';
      default: return `${fieldName} is required.`;
    }
  }

  switch (fieldName) {
    case 'username':
      if (value.length < 3) return 'Username must be at least 3 characters long.';
      if (value.length > 50) return 'Username must be less than 50 characters long.';
      if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores.';
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address.';
      break;

    case 'password':
      if (value.length < 6) return 'Password must be at least 6 characters long.';
      break;

    case 'confirmPassword':
      // This should be checked against the password field
      break;
  }

  return null;
};

/**
 * Checks if error is field-specific
 * @param {string} errorMessage - Error message to check
 * @returns {boolean} - True if field-specific error
 */
export const isFieldError = (errorMessage) => {
  const fieldErrorKeywords = ['username', 'email', 'password', 'required', 'format', 'invalid'];
  return fieldErrorKeywords.some(keyword =>
    errorMessage.toLowerCase().includes(keyword)
  );
};

/**
 * Gets appropriate error display type based on error category
 * @param {string} category - Error category
 * @returns {string} - Display type (error, warning, info)
 */
export const getErrorDisplayType = (category) => {
  switch (category) {
    case ERROR_CATEGORIES.AUTHENTICATION:
      return 'error';
    case ERROR_CATEGORIES.VALIDATION:
      return 'warning';
    case ERROR_CATEGORIES.SERVER:
    case ERROR_CATEGORIES.NETWORK:
      return 'error';
    case ERROR_CATEGORIES.FIELD:
      return 'warning';
    default:
      return 'error';
  }
};

export default {
  parseErrorMessage,
  categorizeError,
  getFieldErrorMessage,
  validateField,
  isFieldError,
  getErrorDisplayType,
  ERROR_CATEGORIES
};
