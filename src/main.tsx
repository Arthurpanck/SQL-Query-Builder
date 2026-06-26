import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App';

const theme = createTheme({
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  primaryColor: 'blue',
  radius: { sm: '6px', md: '8px' },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>
);
