import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#764ba2', // your main color
    },
    secondary: {
      main: '#667eea',
    },
    background: {
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      },
    },
  },
});

export default theme;
