import { MantineProvider, createTheme } from '@mantine/core';
import { ConfigProvider } from './config/ConfigContext';
import { QueryNotebook } from './QueryNotebook';

const theme = createTheme({
  fontFamily: '-apple-system, BlinkMacSystemFont, "Lato", "Helvetica Neue", Arial, sans-serif',
  primaryColor: 'blue',
  radius: { sm: '6px', md: '8px' },
});

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <ConfigProvider>
        {/* Match Metabase: left-aligned, ~9% padding each side, full height */}
        <div style={{
          minHeight: '100vh',
          background: '#fff',
          padding: '32px 40px',
          boxSizing: 'border-box',
        }}>
          <QueryNotebook />
        </div>
      </ConfigProvider>
    </MantineProvider>
  );
}
