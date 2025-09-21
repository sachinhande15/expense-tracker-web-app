import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
  FormControlLabel
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { validateField } from '../utils/errorUtils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Custom validation
    const emailValidation = validateField('email', email);
    const passwordValidation = validateField('password', password);

    setEmailError(emailValidation || '');
    setPasswordError(passwordValidation || '');

    if (emailValidation || passwordValidation) {
      setFormError('Please fix the errors below.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password, keepLoggedIn);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setFormError(result.error || 'Invalid credentials.');
      }
    } catch (err) {
      setFormError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        px: 2
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 450,
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          p: { xs: 4, sm: 6 }
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 700 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'grey.600' }}>
          Sign in to your account
        </Typography>

        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              '& .MuiOutlinedInput-root': { borderRadius: '12px', '&.Mui-focused fieldset': { borderColor: 'primary.main' } }
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
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
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', '&.Mui-focused fieldset': { borderColor: 'primary.main' } }
            }}
          />

          <FormControlLabel
            control={<Checkbox checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn(e.target.checked)} />}
            label="Keep me logged in"
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ py: 1.5, borderRadius: '12px', fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Sign In'}
          </Button>
        </form>

        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Don’t have an account? <Link to="/signup" style={{ color: 'primary.main', fontWeight: 600 }}>Sign Up</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
