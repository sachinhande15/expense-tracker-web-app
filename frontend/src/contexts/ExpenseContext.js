import { createContext, useState, useContext, useEffect } from 'react';
import expenseService from '../services/expenseService';
import { toast } from 'react-toastify';
import {useAuth} from './AuthContext'
const ExpenseContext = createContext();

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalCount: 0,
    categorySummary: {},
    monthlyTotal: 0
  });
  const { isAuthenticated } = useAuth();

  // Load expenses on component mount
  useEffect(() => {
    if (expenseService.isAuthenticated()) {
      loadExpenses();
      loadSummary();
    }
  }, [isAuthenticated]);

  // Load all expenses
  const loadExpenses = async () => {
    setLoading(true);
    try {
      const response = await expenseService.getAllExpenses();
      if (response.success) {
        setExpenses(response.data);
      } else {
        toast.error(response.message || 'Failed to load expenses');
      }
    } catch (error) {
      toast.error('Error loading expenses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load expense summary
  const loadSummary = async () => {
    try {
      const response = await expenseService.getExpenseSummary();
      if (response.success) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Error loading summary:', error);
    }
  };

  // Add new expense
  const addExpense = async (expenseData) => {
    setLoading(true);
    console.log("add expense data is ", expenseData);
    try {
      const response = await expenseService.createExpense(expenseData);
      if (response.success) {
        setExpenses(prev => [response.data, ...prev]);
        await loadSummary(); // Refresh summary
        toast.success(response.message || 'Expense added successfully');
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to add expense');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Error adding expense: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update existing expense
  const updateExpense = async (id, expenseData) => {
    setLoading(true);
    try {
      const response = await expenseService.updateExpense(id, expenseData);
      if (response.success) {
        setExpenses(prev => prev.map(expense =>
          expense.id === id ? response.data : expense
        ));
        await loadSummary(); // Refresh summary
        toast.success(response.message || 'Expense updated successfully');
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to update expense');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Error updating expense: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    setLoading(true);
    try {
      const response = await expenseService.deleteExpense(id);
      if (response.success) {
        setExpenses(prev => prev.filter(expense => expense.id !== id));
        await loadSummary(); // Refresh summary
        toast.success(response.message || 'Expense deleted successfully');
        return { success: true };
      } else {
        toast.error(response.message || 'Failed to delete expense');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Error deleting expense: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Get expense by ID
  const getExpenseById = async (id) => {
    try {
      const response = await expenseService.getExpenseById(id);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Get expenses by category
  const getExpensesByCategory = (category) => {
    return expenses.filter(expense => expense.category === category);
  };

  // Get recent expenses (last 5)
  const getRecentExpenses = (limit = 5) => {
    return expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Search expenses
  const searchExpenses = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return expenses.filter(
      (expense) =>
        (expense.title || "").toLowerCase().includes(lowercaseQuery) ||
        (expense.description || "").toLowerCase().includes(lowercaseQuery) ||
        (expense.category || "").toLowerCase().includes(lowercaseQuery)
    );
  };


  // Filter expenses by date range
  const filterExpensesByDate = (startDate, endDate) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
  };

  const value = {
    // State
    expenses,
    loading,
    summary,

    // Actions
    loadExpenses,
    loadSummary,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,

    // Utilities
    getExpensesByCategory,
    getRecentExpenses,
    searchExpenses,
    filterExpensesByDate
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
