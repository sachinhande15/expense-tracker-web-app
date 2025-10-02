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
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";
import { validateField } from "../utils/errorUtils";

const SignUp = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const emailValidation = validateField("email", email);
    const passwordValidation = validateField("password", password);
    const confirmValidation =
      password !== confirmPassword ? "Passwords do not match" : "";

    setEmailError(emailValidation || "");
    setPasswordError(passwordValidation || "");
    setConfirmPasswordError(confirmValidation || "");

    if (emailValidation || passwordValidation || confirmValidation) {
      setFormError("Please fix the errors below.");
      return;
    }

    setLoading(true);
    try {
      const payload = { username, email, password };
      const result = await register(payload);
      if (result.success) {
        setFormSuccess(
          "Account created successfully! Redirecting to Sign In..."
        );
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setFormError(result.error || "Signup failed.");
      }
    } catch (err) {
      setFormError("Signup failed. Please try again.");
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
          borderRadius: "40px",
          backdropFilter: "blur(12px)",
          maxWidth: { xs: 800, sm: 400, md: 400 }, // adjusts per device
          p: { xs: 0.5, sm: 1, md: 5 },
          // boxShadow: "0 8px 32px rgba(239, 50, 151, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 2, textAlign: "center", fontWeight: 700 }}
        >
          Create Account{" "}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, textAlign: "center" }}>
          Sign up to get started{" "}
        </Typography>
        {formError && (
          <Alert severity="error" sx={{ mb: 2, color : "black", borderRadius : "50px" }}>
            {formError}
          </Alert>
        )}
        {formSuccess && (
          <Alert severity="success" sx={{ mb: 2, color : "black", borderRadius : "50px" }}>
            {formSuccess}
          </Alert>
        )}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
              },
            }}
          />

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
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                background: "rgba(255,255,255,0.9)",
              },
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
              },
            }}
          />

          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
              },
            }}
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
              // background: "linear-gradient(90deg,#667eea 0%,#764ba2 100%)",
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <Typography sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;
