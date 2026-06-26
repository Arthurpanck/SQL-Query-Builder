import { MantineProvider, createTheme } from '@mantine/core';
import { ConfigProvider } from './config/ConfigContext';
import { QueryNotebook } from './QueryNotebook';

const theme = createTheme({
  fontFamily: '-apple-system, BlinkMacSystemFont, "Lato", "Segoe UI", Roboto, sans-serif',
  primaryColor: 'blue',
  radius: { sm: '6px', md: '8px' },
});

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <ConfigProvider>
        <div style={{ minHeight: '100vh', background: '#fff', padding: '32px 40px 32px 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <QueryNotebook />
        </div>
      </ConfigProvider>
    </MantineProvider>
  );
}
