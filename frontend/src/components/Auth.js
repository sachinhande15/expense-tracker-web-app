import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Login from './Login';
import SignUp from './SignUp';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 0 },
        overflow: 'hidden',
        // Animated gradient background
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '200%',
          background: 'linear-gradient(270deg, #C7D2FE, #EEF2FF, #A5B4FC, #C7D2FE)',
          backgroundSize: '800% 800%',
          animation: 'gradientAnimation 20s ease infinite',
          zIndex: -2,
        },
      }}
    >
      {/* Keyframes for animated gradient */}
      <style>
        {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes floatBubble {
            0% { transform: translateY(0px) translateX(0px); opacity: 0.7; }
            50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
            100% { transform: translateY(0px) translateX(0px); opacity: 0.7; }
          }
        `}
      </style>

      {/* Floating bubbles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: 200,
          height: 200,
          backgroundColor: 'rgba(79,70,229,0.1)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'floatBubble 8s ease-in-out infinite',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: 300,
          height: 300,
          backgroundColor: 'rgba(99,102,241,0.1)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'floatBubble 10s ease-in-out infinite alternate',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          right: '-5%',
          width: 150,
          height: 150,
          backgroundColor: 'rgba(147,197,253,0.15)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'floatBubble 12s ease-in-out infinite alternate-reverse',
          zIndex: -1,
        }}
      />

      <Container maxWidth="sm">
        <Box
          sx={{
            width: '100%',
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              minHeight: { xs: 520, sm: 580 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Login Form */}
            <Slide
              direction={isSmallMobile ? 'up' : isLogin ? 'right' : 'left'}
              in={isLogin}
              mountOnEnter
              unmountOnExit
              timeout={isSmallMobile ? 300 : 500}
            >
              <Box
                sx={{
                  width: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  boxShadow: 4,
                  p: { xs: 2, sm: 3 },
                  mb: 4,
                }}
              >
                <Login onToggleMode={toggleAuthMode} />
              </Box>
            </Slide>

            {/* SignUp Form */}
            <Slide
              direction={isSmallMobile ? 'up' : isLogin ? 'left' : 'right'}
              in={!isLogin}
              mountOnEnter
              unmountOnExit
              timeout={isSmallMobile ? 300 : 500}
            >
              <Box
                sx={{
                  width: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  boxShadow: 4,
                  p: { xs: 2, sm: 3 },
                  mb: 4,
                }}
              >
                <SignUp onToggleMode={toggleAuthMode} />
              </Box>
            </Slide>

            {/* Toggle Button Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1.5, sm: 2 },
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                mt: 2,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'grey.700',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  whiteSpace: 'nowrap',
                }}
              >
                {isLogin ? "Don’t have an account?" : "Already have an account?"}
              </Typography>

              <Button
                onClick={toggleAuthMode}
                variant="outlined"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.75, sm: 1 },
                  borderWidth: 2,
                  borderColor: '#4F46E5',
                  color: '#4F46E5',
                  borderRadius: '24px',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#4338CA',
                    backgroundColor: '#EEF2FF',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {isLogin ? (
                  <>
                    Sign Up <ArrowForward fontSize="small" />
                  </>
                ) : (
                  <>
                    <ArrowBack fontSize="small" /> Sign In
                  </>
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Auth;
