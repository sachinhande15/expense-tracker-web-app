// Expense data types and interfaces

export const EXPENSE_CATEGORIES = {
  FOOD_DINING: 'Food & Dining',
  TRANSPORTATION: 'Transportation',
  SHOPPING: 'Shopping',
  ENTERTAINMENT: 'Entertainment',
  HEALTHCARE: 'Healthcare',
  EDUCATION: 'Education',
  UTILITIES: 'Utilities',
  TRAVEL: 'Travel',
  OTHERS: 'Others'
};

export const CATEGORY_ICONS = {
  'Food & Dining': '🍽️',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Healthcare': '⚕️',
  'Education': '📚',
  'Utilities': '💡',
  'Travel': '✈️',
  'Others': '📦'
};

export const EXPENSE_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Expense data structure
// @typedef {Object} Expense
// @property {number} id - Unique identifier
// @property {string} title - Expense title
// @property {number} amount - Expense amount
// @property {string} category - Expense category
// @property {string} [description] - Optional description
// @property {string} date - Date in ISO string format
// @property {string} type - Either 'income' or 'expense'
// @property {string} createdAt - Creation timestamp
// @property {string} updatedAt - Last update timestamp

// Expense form data structure
// @typedef {Object} ExpenseFormData
// @property {string} title - Expense title
// @property {number} amount - Expense amount
// @property {string} category - Expense category
// @property {string} description - Description
// @property {string} date - Date
// @property {string} type - Either 'income' or 'expense'

// Expense summary structure
// @typedef {Object} ExpenseSummary
// @property {number} totalExpenses - Total amount of all expenses
// @property {number} totalCount - Total number of expenses
// @property {Object} categorySummary - Summary by category
// @property {number} monthlyTotal - Total for current month

// API Response structure
// @typedef {Object} ApiResponse
// @property {boolean} success - Success status
// @property {*} [data] - Response data
// @property {string} [error] - Error message
// @property {string} message - Response message

// Validation rules
export const VALIDATION_RULES = {
  TITLE: {
    required: true,
    minLength: 1,
    maxLength: 100
  },
  AMOUNT: {
    required: true,
    min: 0.01,
    max: 999999.99
  },
  DESCRIPTION: {
    maxLength: 500
  },
  CATEGORY: {
    required: true
  },
  DATE: {
    required: true
  }
};

// Form validation function
export const validateExpenseForm = (data) => {
  const errors = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > VALIDATION_RULES.TITLE.maxLength) {
    errors.title = `Title must be less than ${VALIDATION_RULES.TITLE.maxLength} characters`;
  }

  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  } else if (data.amount > VALIDATION_RULES.AMOUNT.max) {
    errors.amount = `Amount must be less than ${VALIDATION_RULES.AMOUNT.max}`;
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  if (!data.date) {
    errors.date = 'Date is required';
  }

  if (data.description && data.description.length > VALIDATION_RULES.DESCRIPTION.maxLength) {
    errors.description = `Description must be less than ${VALIDATION_RULES.DESCRIPTION.maxLength} characters`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
