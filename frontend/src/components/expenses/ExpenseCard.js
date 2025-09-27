import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Avatar,
  Fade
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { formatCurrency, formatDate, getRelativeTime, getCategoryIcon, getCategoryColor, getExpenseTypeColor, getExpenseTypeIcon } from '../../utils/helpers';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  console.log("Expense from expense card is ", expense)

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(expense);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(expense);
    handleMenuClose();
  };

  const isIncome = expense.type === 'income';
  const categoryColor = getCategoryColor(expense.category);
  const expenseTypeColor = getExpenseTypeColor(expense.type);

  return (
    <Fade in={true} timeout={300}>
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            '& .card-actions': {
              opacity: 1
            }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: isIncome
              ? 'linear-gradient(90deg, #4caf50, #66bb6a)'
              : 'linear-gradient(90deg, #2196f3, #42a5f5)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: categoryColor,
                  color: 'white',
                  fontSize: '1.5rem'
                }}
              >
                {getCategoryIcon(expense.categoryName)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    color: 'text.primary'
                  }}
                >
                  {expense.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={expense.categoryName}
                    size="small"
                    sx={{
                      bgcolor: categoryColor + '20',
                      color: categoryColor,
                      fontWeight: 500,
                      fontSize: '0.75rem'
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {getRelativeTime(expense.date)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ textAlign: 'right', mr: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: expenseTypeColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {isIncome ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                  {formatCurrency(expense.amount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(expense.date)}
                </Typography>
              </Box>

              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{
                  opacity: 1,
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {expense.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {expense.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Type:
              </Typography>
              <Chip
                label={expense.type}
                size="small"
                sx={{
                  bgcolor: expenseTypeColor + '20',
                  color: expenseTypeColor,
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  fontSize: '0.7rem'
                }}
                icon={<span>{getExpenseTypeIcon(expense.type)}</span>}
              />
            </Box>

            <Typography variant="caption" color="text.secondary">
              ID: {expense.id}
            </Typography>
          </Box>
        </CardContent>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              minWidth: 120
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleEdit} sx={{ py: 1.5 }}>
            <Edit fontSize="small" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            sx={{
              py: 1.5,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'error.contrastText'
              }
            }}
          >
            <Delete fontSize="small" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Menu>
      </Card>
    </Fade>
  );
};

export default ExpenseCard;
