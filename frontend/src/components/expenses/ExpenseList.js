import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Pagination,
  Chip,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Search,
  Refresh
} from '@mui/icons-material';
import { useExpense } from '../../contexts/ExpenseContext';
import ExpenseCard from './ExpenseCard';
import { EXPENSE_CATEGORIES } from '../../types/expense';
import { formatCurrency, getCategoryIcon, debounce } from '../../utils/helpers';

const ExpenseList = ({ onEdit, onDelete }) => {
  const { expenses, loading, searchExpenses } = useExpense();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleSearchChange = (event) => {
    debouncedSearch(event.target.value);
  };

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses;

    // Apply search filter
    if (searchQuery) {
      filtered = searchExpenses(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [expenses, searchQuery, selectedCategory, sortBy, sortOrder, searchExpenses]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredAndSortedExpenses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Calculate summary for current filtered results
  const summary = useMemo(() => {
    const total = filteredAndSortedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = filteredAndSortedExpenses.length;
    const average = count > 0 ? total / count : 0;

    return {
      total,
      count,
      average
    };
  }, [filteredAndSortedExpenses]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading expenses...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: 'primary.light',
              color: 'white'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatCurrency(summary.total)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Amount
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: 'success.light',
              color: 'white'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {summary.count}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Items
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: 'warning.light',
              color: 'white'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatCurrency(summary.average)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Average
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { md: 'center' } }}>
          {/* Search */}
          <TextField
            placeholder="Search expenses..."
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          {/* Category Filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              label="Category"
              startAdornment={
                selectedCategory !== 'all' ? (
                  <Box sx={{ ml: 1, mr: 1 }}>
                    {getCategoryIcon(selectedCategory)}
                  </Box>
                ) : null
              }
            >
              <MenuItem value="all">All Categories</MenuItem>
              {Object.values(EXPENSE_CATEGORIES).map((category) => (
                <MenuItem key={category} value={category}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{getCategoryIcon(category)}</span>
                    {category}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort Options */}
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="amount">Amount</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="category">Category</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Order"
            >
              <MenuItem value="desc">High-Low</MenuItem>
              <MenuItem value="asc">Low-High</MenuItem>
            </Select>
          </FormControl>

          <Chip
            icon={<Refresh />}
            label="Refresh"
            onClick={handleRefresh}
            variant="outlined"
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      </Paper>

      {/* Results Info */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {paginatedExpenses.length} of {filteredAndSortedExpenses.length} expenses
        </Typography>
        {selectedCategory !== 'all' && (
          <Chip
            label={`Category: ${selectedCategory}`}
            onDelete={() => setSelectedCategory('all')}
            size="small"
          />
        )}
      </Box>

      {/* No Results */}
      {filteredAndSortedExpenses.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          {searchQuery || selectedCategory !== 'all'
            ? 'No expenses found matching your criteria.'
            : 'No expenses recorded yet. Add your first expense to get started!'
          }
        </Alert>
      ) : (
        <>
          {/* Expense Grid */}
          <Grid container spacing={3}>
            {paginatedExpenses.map((expense) => (
              <Grid item xs={12} sm={6} lg={4} key={expense.id}>
                <ExpenseCard
                  expense={expense}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ExpenseList;
