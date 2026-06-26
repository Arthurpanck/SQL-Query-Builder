import { QueryNotebook } from './QueryNotebook';

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fc',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <QueryNotebook />
    </div>
  );
}
