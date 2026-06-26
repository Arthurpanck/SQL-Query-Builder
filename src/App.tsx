import { QueryNotebook } from './QueryNotebook';

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 32px',
    }}>
      <QueryNotebook />
    </div>
  );
}
