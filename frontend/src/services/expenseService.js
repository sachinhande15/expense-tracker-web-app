// Real API service - connects to Spring Boot backend
import axios from 'axios';
import API_CONFIG from './apiConfig';
import { storage } from '../utils/storage';


const TOKEN_KEY = 'token';
const USER_KEY = 'user';

class ExpenseService {

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = storage.get(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Get all expenses for the current user
  async getAllExpenses() {
    try {
      const response = await this.api.get(API_CONFIG.ENDPOINTS.EXPENSES);
      return {
        success: true,
        data: response.data,
        message: 'Expenses retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Failed to retrieve expenses'
      };
    }
  }

  // Get expense by ID
  async getExpenseById(id) {
    try {
      const response = await this.api.get(API_CONFIG.ENDPOINTS.EXPENSE_BY_ID(id));
      return {
        success: true,
        data: response.data,
        message: 'Expense retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Failed to retrieve expense'
      };
    }
  }

  // Create new expense
  async createExpense(expenseData) {
    try {
      const response = await this.api.post(API_CONFIG.ENDPOINTS.EXPENSES, expenseData);
      return {
        success: true,
        data: response.data,
        message: 'Expense created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Failed to create expense'
      };
    }
  }

  // Update expense
  async updateExpense(id, expenseData) {
    try {
      const response = await this.api.put(API_CONFIG.ENDPOINTS.EXPENSE_BY_ID(id), expenseData);
      return {
        success: true,
        data: response.data,
        message: 'Expense updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Failed to update expense'
      };
    }
  }

  // Delete expense
  async deleteExpense(id) {
    try {
      await this.api.delete(API_CONFIG.ENDPOINTS.EXPENSE_BY_ID(id));
      return {
        success: true,
        message: 'Expense deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Failed to delete expense'
      };
    }
  }

  // Get expense summary
  async getExpenseSummary() {
    try {
      const response = await this.api.get(API_CONFIG.ENDPOINTS.EXPENSE_SUMMARY);
      return {
        success: true,
        data: response.data,
        message: 'Summary retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Failed to retrieve summary'
      };
    }
  }

  // Get categories
  async getCategories() {
    try {
      const response = await this.api.get(API_CONFIG.ENDPOINTS.CATEGORIES);
      return {
        success: true,
        data: response.data,
        message: 'Categories retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Failed to retrieve categories'
      };
    }
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await this.api.post('/auth/login', credentials);
      const { token, id, username, email } = response.data;

      // Store token & user safely
      storage.set(TOKEN_KEY, token, 1000 * 60 * 60); // 1 hour expiry
      storage.set(USER_KEY, { id, username, email }, 1000 * 60 * 60);

      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Login failed'
      };
    }
  }

  async register(userData) {
    try {
      const response = await this.api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
        message: 'Registration successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Registration failed'
      };
    }
  }

  // Logout
  logout() {
    storage.remove(TOKEN_KEY);
    storage.remove(USER_KEY);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!storage.get(TOKEN_KEY);
  }

  // Get current user
  getCurrentUser() {
    return storage.get(USER_KEY);
  }
}

const expenseService = new ExpenseService();
export default expenseService;
