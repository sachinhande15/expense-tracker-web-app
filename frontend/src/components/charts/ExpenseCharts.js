import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useExpense } from "../../contexts/ExpenseContext";
import {
  formatCurrency,
  getCategoryColor,
  groupExpensesByCategory,
  getMonthlyTotals,
} from "../../utils/helpers";


const ExpenseCharts = () => {
  const { expenses } = useExpense();
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState(0);

  // Category-wise expense data
  const categoryData = useMemo(() => {
    const grouped = groupExpensesByCategory(expenses);
    return Object.entries(grouped)
      .map(([category, categoryExpenses]) => ({
        name: category,
        value: categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        count: categoryExpenses.length,
        color: getCategoryColor(category),
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Monthly trend data
  const monthlyData = useMemo(() => {
    const monthlyTotals = getMonthlyTotals(expenses);
    return Object.entries(monthlyTotals)
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        amount: data.total,
        count: data.count,
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6); // Last 6 months
  }, [expenses]);

  // Daily spending for the last 30 days
  const dailyData = useMemo(() => {
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      const dayExpenses = expenses.filter((exp) => exp.date === dateString);
      const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      last30Days.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount: total,
        count: dayExpenses.length,
      });
    }
    return last30Days;
  }, [expenses]);

  // Income vs Expense comparison
  const incomeVsExpense = useMemo(() => {
    const income = expenses
      .filter((exp) => exp.type === "income")
      .reduce((sum, exp) => sum + exp.amount, 0);

    const expense = expenses
      .filter((exp) => exp.type === "expense")
      .reduce((sum, exp) => sum + exp.amount, 0);

    return [
      { name: "Income", value: income, color: "#4caf50" },
      { name: "Expenses", value: expense, color: "#f44336" },
    ];
  }, [expenses]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const renderCategoryChart = () => (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 3, mx: 'auto' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Expenses by Category
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 3, mx: 'auto' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Category Breakdown
            </Typography>
            <Box sx={{ height: 300, overflowY: "auto" }}>
              {categoryData.map((category, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1,
                    px: 2,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: "grey.50",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: category.color,
                      }}
                    />
                    <Typography variant="body2">{category.name}</Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(category.value)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.count} items
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTrendChart = () => (
    <Card elevation={2} sx={{ borderRadius: 3, mx: 'auto', maxWidth: 1200 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Monthly Spending Trend
        </Typography>
        <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.grey[300]}
              />
              <XAxis
                dataKey="month"
                stroke={theme.palette.text.secondary}
                fontSize={12}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#2196f3"
                fill="rgba(33, 150, 243, 0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  const renderDailyChart = () => (
    <Card elevation={2} sx={{ borderRadius: 3, mx: 'auto', maxWidth: 1200 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Daily Spending (Last 30 Days)
        </Typography>
        <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.grey[300]}
              />
              <XAxis
                dataKey="date"
                stroke={theme.palette.text.secondary}
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#2196f3" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  const renderIncomeVsExpense = () => (
    <Card elevation={2} sx={{ borderRadius: 3, mx: 'auto', maxWidth: 800 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Income vs Expenses
        </Typography>
        <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incomeVsExpense}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {incomeVsExpense.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Categories" sx={{ textTransform: "none" }} />
        <Tab label="Monthly Trend" sx={{ textTransform: "none" }} />
        <Tab label="Daily View" sx={{ textTransform: "none" }} />
        <Tab label="Income vs Expense" sx={{ textTransform: "none" }} />
      </Tabs>

      {activeTab === 0 && renderCategoryChart()}
      {activeTab === 1 && renderTrendChart()}
      {activeTab === 2 && renderDailyChart()}
      {activeTab === 3 && renderIncomeVsExpense()}
    </Box>
  );
};

export default ExpenseCharts;
