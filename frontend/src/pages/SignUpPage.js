import { Box, Container } from '@mui/material';
import SignUp from '../components/SignUp';

const SignUpPage = () => {
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
        background: 'linear-gradient(135deg, #EEF2FF 0%, #C7D2FE 100%)',
      }}
    >
      {/* Floating bubbles */}
      <Box sx={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: 200,
        height: 200,
        backgroundColor: 'rgba(79,70,229,0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)',
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '-15%',
        right: '-10%',
        width: 300,
        height: 300,
        backgroundColor: 'rgba(99,102,241,0.1)',
        borderRadius: '50%',
        filter: 'blur(100px)',
      }} />

      <Container maxWidth="sm">
        <SignUp />
      </Container>
    </Box>
  );
};

export default SignUpPage;
