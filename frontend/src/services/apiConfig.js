// API Configuration for Expense Tracker
// This will be updated when the Java Spring Boot backend is ready

const API_CONFIG = {
  // Base URL for the API - update this when backend is deployed
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/expense_tracker/api',

  // API Endpoints
  ENDPOINTS: {
    // Expense endpoints
    EXPENSES: '/expenses',
    EXPENSE_BY_ID: (id) => `/expenses/${id}`,
    EXPENSE_SUMMARY: '/expenses/summary',

    // Category endpoints
    CATEGORIES: '/categories',

    // User endpoints
    USER_PROFILE: '/user/profile',
    USER_EXPENSES: '/user/expenses'
  },

  // HTTP Status codes
  STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },

  // Request timeout (in milliseconds)
  TIMEOUT: 10000
};

export default API_CONFIG;
