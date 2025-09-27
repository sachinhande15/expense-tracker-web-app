import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useExpense } from '../contexts/ExpenseContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Paper,
  Tabs,
  Tab,
  Fab
} from '@mui/material';
import {
  Logout,
  TrendingUp,
  Category,
  Add,
  BarChart,
  List,
  PieChart,
  CurrencyRupee
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import ExpenseForm from './expenses/ExpenseForm';
import ExpenseList from './expenses/ExpenseList';
import ExpenseCharts from './charts/ExpenseCharts';
import { formatCurrency } from '../utils/helpers';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { summary, loading } = useExpense();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserInitials = (value) => {
    if (!value) return "U";
    const cleaned = value.split(/[@._]/)[0];
    const words = cleaned.split(" ").filter(Boolean);
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out successfully');
    navigate('/login');
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleFormClose = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const handleFormSuccess = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
    toast.success(editingExpense ? 'Expense updated successfully!' : 'Expense added successfully!');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f4f6f8', position: 'relative' }}>
      {/* Floating Background Circles */}
      <Box sx={{
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        bgcolor: 'primary.light',
        opacity: 0.15,
        borderRadius: '50%',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -150,
        right: -150,
        width: 400,
        height: 400,
        bgcolor: 'secondary.light',
        opacity: 0.15,
        borderRadius: '50%',
        zIndex: 0
      }} />

      {/* Modern Navbar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            💰 Expense Tracker
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }}>
              {getUserInitials(user?.username || user?.email)}
            </Avatar>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              {user?.name}
            </Typography>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, position: 'relative', zIndex: 1 }}>
        {/* Welcome Card */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '2rem',
                fontWeight: 700,
                border: '3px solid rgba(255,255,255,0.3)'
              }}
            >
              {getUserInitials(user?.username || user?.email)}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {getGreeting()}, {user?.name}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                Track your expenses and manage your budget effectively
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Expenses */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={4} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <CurrencyRupee sx={{ fontSize: 26, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {loading ? '...' : formatCurrency(summary.totalExpenses)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Amount
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Spend */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={4} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <TrendingUp sx={{ fontSize: 26, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {loading ? '...' : formatCurrency(summary.monthlyTotal)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Items */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={4} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Category sx={{ fontSize: 28, color: 'warning.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {loading ? '...' : summary.totalCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={4} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <BarChart sx={{ fontSize: 28, color: 'info.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {loading ? '...' : Object.keys(summary.categorySummary).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Tabs */}
        <Paper elevation={3} sx={{ borderRadius: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 }
            }}
          >
            <Tab icon={<List />} label="Expenses" iconPosition="start" />
            <Tab icon={<PieChart />} label="Analytics" iconPosition="start" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <ExpenseList
                onEdit={handleEditExpense}
              />
            )}
            {activeTab === 1 && <ExpenseCharts />}
          </Box>
        </Paper>
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add expense"
        onClick={handleAddExpense}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          boxShadow: '0 6px 25px rgba(102,126,234,0.4)',
          '&:hover': { transform: 'scale(1.1)', boxShadow: '0 8px 30px rgba(102,126,234,0.5)' }
        }}
      >
        <Add />
      </Fab>

      {/* Expense Form */}
      <ExpenseForm
        open={showExpenseForm}
        onClose={handleFormClose}
        expense={editingExpense}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
};

export default Dashboard;
