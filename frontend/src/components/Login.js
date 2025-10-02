import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { validateField } from "../utils/errorUtils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const emailValidation = validateField("email", email);
    const passwordValidation = validateField("password", password);

    setEmailError(emailValidation || "");
    setPasswordError(passwordValidation || "");

    if (emailValidation || passwordValidation) {
      setFormError("Please fix the errors below.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setFormError(result.error || "Invalid credentials.");
      }
    } catch (err) {
      setFormError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: 800, sm: 400, md: 400 }, // adjusts per device
          p: { xs: 0.5, sm: 1, md: 5 },
          borderRadius: "40px",
          // alignItems: "center",
          // justifyContent: "center",
          // minHeight: "50vh",
          // boxShadow: "0 8px 32px rgba(198, 24, 117, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 1, textAlign: "center", fontWeight: 700 }}
        >
          Sign In{" "}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 3, textAlign: "center", color: "grey.600" }}
        >
          Welcome back, please login to continue{" "}
        </Typography>
        {formError && (
          <Alert severity="error" sx={{ mb: 2 , color : "black", borderRadius : "50px"}}>
            {formError}
          </Alert>
        )}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
        >
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "30px" }, // rounded input
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "30px" }, // rounded input
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
              />
            }
            label="Keep me logged in"
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: "30px",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <Typography sx={{ mt: 3, textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link
            to="/signup"
            style={{
              fontWeight: 600,
              textDecoration: "none",
              color: "#1976d2",
            }}
          >
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
