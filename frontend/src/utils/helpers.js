import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { EXPENSE_CATEGORIES , CATEGORY_ICONS} from "../types/expense";
// Format currency values
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date for display
export const formatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return dateString;
  }
};

// Get relative time (e.g., "2 days ago")
export const getRelativeTime = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return dateString;
  }
};

// Get category icon
export const getCategoryIcon = (category) => {
  if (!category) return '📦'; // default icon for undefined
  // Normalize category to match CATEGORY_ICONS keys
  const found = Object.values(EXPENSE_CATEGORIES).find(
    (c) => c.toLowerCase() === category.toLowerCase()
  );
  return CATEGORY_ICONS[found] || '📦';
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    'Food & Dining': '#FF6B6B',
    'Transportation': '#4ECDC4',
    'Shopping': '#45B7D1',
    'Entertainment': '#96CEB4',
    'Healthcare': '#FFEAA7',
    'Education': '#DDA0DD',
    'Utilities': '#98D8C8',
    'Travel': '#F7DC6F',
    'Others': '#AED6F1'
  };
  return colors[category] || '#BDC3C7';
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Group expenses by category
export const groupExpensesByCategory = (expenses) => {
  return expenses.reduce((groups, expense) => {
    const category = expense.categoryName;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(expense);
    return groups;
  }, {});
};

// Get expenses for current month
export const getCurrentMonthExpenses = (expenses) => {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);

  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, {
      start: startOfCurrentMonth,
      end: endOfCurrentMonth
    });
  });
};

// Get monthly expense totals
export const getMonthlyTotals = (expenses) => {
  const monthlyTotals = {};

  expenses.forEach(expense => {
    const date = parseISO(expense.date);
    const monthKey = format(date, 'yyyy-MM');

    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = {
        total: 0,
        count: 0,
        expenses: []
      };
    }

    monthlyTotals[monthKey].total += expense.amount;
    monthlyTotals[monthKey].count += 1;
    monthlyTotals[monthKey].expenses.push(expense);
  });

  return monthlyTotals;
};

// Sort expenses by date (newest first)
export const sortExpensesByDate = (expenses, ascending = false) => {
  return [...expenses].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Sort expenses by amount
export const sortExpensesByAmount = (expenses, ascending = true) => {
  return [...expenses].sort((a, b) => {
    return ascending ? a.amount - b.amount : b.amount - a.amount;
  });
};

// Generate unique ID
export const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get color based on expense type
export const getExpenseTypeColor = (type) => {
  return type === 'income' ? '#4caf50' : '#f44336';
};

// Get expense type icon
export const getExpenseTypeIcon = (type) => {
  return type === 'income' ? '💰' : '💸';
};

// Calculate total expenses
export const calculateTotal = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Get expense statistics
export const getExpenseStats = (expenses) => {
  const total = calculateTotal(expenses);
  const count = expenses.length;
  const average = count > 0 ? total / count : 0;

  const categories = [...new Set(expenses.map(exp => exp.category))];
  const categoryCount = categories.length;

  return {
    total,
    count,
    average,
    categoryCount
  };
};
