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
  AttachMoney,
  Category,
  Add,
  BarChart,
  List,
  PieChart
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import ExpenseForm from './expenses/ExpenseForm';
import ExpenseList from './expenses/ExpenseList';
import DeleteConfirmDialog from './expenses/DeleteConfirmDialog';
import ExpenseCharts from './charts/ExpenseCharts';
import { formatCurrency } from '../utils/helpers';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { summary, loading } = useExpense();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  const handleDeleteExpense = (expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const handleFormSuccess = (expense) => {
    setShowExpenseForm(false);
    setEditingExpense(null);
    toast.success(editingExpense ? 'Expense updated successfully!' : 'Expense added successfully!');
  };

  const handleDeleteConfirm = () => {
    // The actual deletion is handled in ExpenseList component
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Modern App Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            💰 Expense Tracker
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {getUserInitials(user?.name || 'U')}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                {user?.name}
              </Typography>
            </Box>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Enhanced Welcome Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                fontSize: '2rem',
                fontWeight: 700,
                border: '3px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              {getUserInitials(user?.name || 'U')}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                {getGreeting()}, {user?.name}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                Track your expenses and manage your budget effectively
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Enhanced Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 4,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <AttachMoney sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  {loading ? '...' : formatCurrency(summary.totalExpenses)}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Total Expenses
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 4,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <TrendingUp sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                  {loading ? '...' : formatCurrency(summary.monthlyTotal)}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  This Month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 4,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Category sx={{ fontSize: 56, color: 'warning.main', mb: 2 }} />
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                  {loading ? '...' : summary.totalCount}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Total Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 4,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <BarChart sx={{ fontSize: 56, color: 'info.main', mb: 2 }} />
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                  {loading ? '...' : Object.keys(summary.categorySummary).length}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Categories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper elevation={3} sx={{ borderRadius: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 72,
                fontSize: '1rem'
              }
            }}
          >
            <Tab
              icon={<List />}
              label="Expenses"
              iconPosition="start"
              sx={{ minHeight: 72 }}
            />
            <Tab
              icon={<PieChart />}
              label="Analytics"
              iconPosition="start"
              sx={{ minHeight: 72 }}
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <ExpenseList
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            )}

            {activeTab === 1 && (
              <ExpenseCharts />
            )}
          </Box>
        </Paper>
      </Container>

      {/* Enhanced Floating Action Button */}
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
          boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 8px 30px rgba(102, 126, 234, 0.5)'
          }
        }}
      >
        <Add />
      </Fab>

      {/* Expense Form Dialog */}
      <ExpenseForm
        open={showExpenseForm}
        onClose={handleFormClose}
        expense={editingExpense}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        expense={expenseToDelete}
      />
    </Box>
  );
};

export default Dashboard;
