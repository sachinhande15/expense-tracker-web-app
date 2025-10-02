import React, { createContext, useState, useContext, useEffect } from 'react';
import expenseService from '../services/expenseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (expenseService.isAuthenticated()) {
        const userData = expenseService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await expenseService.login({ email, password });
      if (response.success) {
        const userData = expenseService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        console.error('Login failed:', response.message);
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await expenseService.register(userData);
      if (response.success) {
        const userData = expenseService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    expenseService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
