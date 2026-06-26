import { QueryNotebook } from './QueryNotebook';

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '32px 24px',
    }}>
      <QueryNotebook />
    </div>
  );
}
