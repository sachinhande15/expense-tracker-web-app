import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import { Delete, Warning } from '@mui/icons-material';
import { formatCurrency, getCategoryIcon } from '../../utils/helpers';

const DeleteConfirmDialog = ({ open, onClose, onConfirm, expense }) => {
  if (!expense) return null;

  const handleConfirm = () => {
    onConfirm(expense.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: 'visible' } }}
    >
      {/* Warning Icon */}
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: 'error.main',
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}
      >
        <Warning sx={{ color: 'white', fontSize: 30 }} />
      </Box>

      <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>
          Delete Expense
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <DialogContentText sx={{ textAlign: 'center', mb: 3 }}>
          Are you sure you want to delete this expense? This action cannot be undone.
        </DialogContentText>

        {/* Expense Details */}
        <Box
          sx={{
            bgcolor: 'grey.50',
            borderRadius: 2,
            p: 2,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}
            >
              {getCategoryIcon(expense.category)}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{expense.title}</Typography>
              <Typography variant="body2" color="text.secondary">{expense.category}</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
              -{formatCurrency(expense.amount)}
            </Typography>
          </Box>

          {expense.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {expense.description}
            </Typography>
          )}

          <Typography variant="caption" color="text.secondary">
            Date: {new Date(expense.date).toLocaleDateString()}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          startIcon={<Delete />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            bgcolor: 'error.main',
            '&:hover': { bgcolor: 'error.dark' }
          }}
        >
          Delete Expense
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
