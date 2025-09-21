import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useExpense } from '../../contexts/ExpenseContext';
import { EXPENSE_CATEGORIES, validateExpenseForm } from '../../types/expense';
import { getCategoryIcon } from '../../utils/helpers';

const ExpenseForm = ({ open, onClose, expense = null, onSuccess }) => {
  const { addExpense, updateExpense } = useExpense();
  const isEditing = !!expense;

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date(),
    type: 'expense'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form when expense prop changes
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || '',
        description: expense.description || '',
        date: new Date(expense.date) || new Date(),
        type: expense.type || 'expense'
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: '',
        description: '',
        date: new Date(),
        type: 'expense'
      });
    }
    setErrors({});
  }, [expense, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateExpenseForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: formData.date.toISOString().split('T')[0]
      };

      let result;
      if (isEditing) {
        result = await updateExpense(expense.id, expenseData);
      } else {
        result = await addExpense(expenseData);
      }

      if (result.success) {
        onClose();
        if (onSuccess) {
          onSuccess(result.data);
        }
      }
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      amount: '',
      category: '',
      description: '',
      date: new Date(),
      type: 'expense'
    });
    setErrors({});
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          fontWeight: 600,
          fontSize: '1.25rem'
        }}>
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Expense Type Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.type === 'income'}
                      onChange={(e) => handleInputChange('type', e.target.checked ? 'income' : 'expense')}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formData.type === 'income' ? '💰 Income' : '💸 Expense'}
                    </Typography>
                  }
                />
              </Box>

              {/* Title */}
              <TextField
                label="Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                fullWidth
                required
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Amount */}
              <TextField
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                error={!!errors.amount}
                helperText={errors.amount}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Category */}
              <FormControl fullWidth error={!!errors.category} required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  label="Category"
                  sx={{ borderRadius: 2 }}
                >
                  {Object.values(EXPENSE_CATEGORIES).map((category) => (
                    <MenuItem key={category} value={category}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{getCategoryIcon(category)}</span>
                        {category}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.category}
                  </Typography>
                )}
              </FormControl>

              {/* Date */}
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={(date) => handleInputChange('date', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.date,
                    helperText: errors.date,
                    sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }
                  }
                }}
              />

              {/* Description */}
              <TextField
                label="Description (Optional)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                minWidth: 100,
                background: formData.type === 'income'
                  ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                  : 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
              }}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ExpenseForm;
