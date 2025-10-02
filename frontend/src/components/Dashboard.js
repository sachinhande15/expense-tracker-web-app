import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useExpense } from "../contexts/ExpenseContext";
import { useNavigate } from "react-router-dom";
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
  Fab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Logout,
  TrendingUp,
  Category,
  Add,
  BarChart,
  List,
  PieChart,
  CurrencyRupee,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import ExpenseForm from "./expenses/ExpenseForm";
import ExpenseList from "./expenses/ExpenseList";
import ExpenseCharts from "./charts/ExpenseCharts";
import { formatCurrency } from "../utils/helpers";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { summary, loading } = useExpense();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // mobile-first flag

  const [activeTab, setActiveTab] = useState(0);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
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
    toast.info("You have been logged out successfully");
    navigate("/login");
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
    toast.success(
      editingExpense
        ? "Expense updated successfully!"
        : "Expense added successfully!"
    );
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        position: "relative",
      }}
    >
      {/* Background Circles */}
      <Box
        sx={{
          position: "absolute",
          top: -80,
          left: -80,
          width: 200,
          height: 200,
          bgcolor: "primary.light",
          opacity: 0.1,
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          right: -100,
          width: 250,
          height: 250,
          bgcolor: "secondary.light",
          opacity: 0.1,
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          zIndex: 1000,
        }}
      >
        <Toolbar
          sx={{
            flexWrap: { xs: "wrap", sm: "nowrap" }, // wrap on small screens
            gap: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              minWidth: 0,
            }}
          >
            💰 Expense Tracker
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 }, // smaller gap on mobile
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "flex-start", sm: "flex-end" },
              mt: { xs: 1, sm: 0 }, // margin-top for wrapping on mobile
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "rgba(255,255,255,0.2)",
                fontSize: "0.875rem",
              }}
            >
              {getUserInitials(user?.username || user?.email)}
            </Avatar>
            <Typography
              variant="body2"
              sx={{
                color: "white",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 120,
              }}
            >
              {user?.name}
            </Typography>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                whiteSpace: "nowrap",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{ mt: 3, mb: 4, position: "relative", zIndex: 1 }}
      >
        {/* Welcome Card */}
        <Paper
          elevation={3}
          sx={{
            p: isMobile ? 2 : 4,
            mb: 3,
            borderRadius: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: isMobile ? 60 : 80,
                height: isMobile ? 60 : 80,
                fontSize: isMobile ? "1.5rem" : "2rem",
                bgcolor: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              {getUserInitials(user?.username || user?.email)}
            </Avatar>
            <Box textAlign={isMobile ? "center" : "left"}>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>
                {getGreeting()}, {user?.name}!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Track your expenses and manage your budget effectively
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            {
              icon: <CurrencyRupee sx={{ color: "primary.main" }} />,
              value: formatCurrency(summary.totalExpenses),
              label: "Total Amount",
            },
            {
              icon: <TrendingUp sx={{ color: "success.main" }} />,
              value: formatCurrency(summary.monthlyTotal),
              label: "This Month",
            },
            {
              icon: <Category sx={{ color: "warning.main" }} />,
              value: summary.totalCount,
              label: "Total Items",
            },
            {
              icon: <BarChart sx={{ color: "info.main" }} />,
              value: Object.keys(summary.categorySummary || {}).length,
              label: "Categories",
            },
          ].map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card elevation={4} sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent sx={{ textAlign: "center", p: isMobile ? 2 : 4 }}>
                  {card.icon}
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    fontWeight={700}
                    sx={{ my: 1 }}
                  >
                    {loading ? "..." : card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Paper elevation={3} sx={{ borderRadius: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab icon={<List />} label="Expenses" iconPosition="start" />
            <Tab icon={<PieChart />} label="Analytics" iconPosition="start" />
          </Tabs>

          <Box sx={{ p: isMobile ? 2 : 3 }}>
            {activeTab === 0 && <ExpenseList onEdit={handleEditExpense} />}
            {activeTab === 1 && <ExpenseCharts />}
          </Box>
        </Paper>
      </Container>

      {/* FAB */}
      <Fab
        color="primary"
        aria-label="add expense"
        onClick={handleAddExpense}
        sx={{
          position: "fixed",
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          width: isMobile ? 56 : 64,
          height: isMobile ? 56 : 64,
          zIndex: 1500, // ensure it's above all other elements
          boxShadow: "0 6px 25px rgba(102,126,234,0.4)",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0 8px 30px rgba(102,126,234,0.5)",
          },
        }}
      >
        <Add sx={{ color: "white", fontSize: isMobile ? 28 : 32 }} />
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
