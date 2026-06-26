import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, verifyPin, loading, error, pendingMfa } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');

  if (pendingMfa) {
    return (
      <form
        onSubmit={(e) => { e.preventDefault(); verifyPin(pin); }}
        style={formStyle}
      >
        <h2 style={titleStyle}>Two-Factor Verification</h2>
        <p style={{ color: '#64748b', marginBottom: 16 }}>Enter the PIN sent to your device.</p>
        <input
          style={inputStyle}
          type="text"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
        {error && <p style={errorStyle}>{error}</p>}
        <button style={btnStyle} type="submit" disabled={loading}>
          {loading ? 'Verifying…' : 'Verify PIN'}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); login({ email, password }); }}
      style={formStyle}
    >
      <h2 style={titleStyle}>TeleCare Login</h2>
      <input
        style={inputStyle}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        style={inputStyle}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p style={errorStyle}>{error}</p>}
      <button style={btnStyle} type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
      <p style={footerStyle}>
        Don't have an account?{' '}
        <span onClick={() => navigate('/register')} style={linkStyle}>Register</span>
      </p>
    </form>
  );
}

const footerStyle: React.CSSProperties = { textAlign: 'center', fontSize: 13, color: '#64748b', margin: 0 };
const linkStyle:   React.CSSProperties = { color: '#1e40af', fontWeight: 600, cursor: 'pointer' };

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  width: 360,
  padding: 32,
  borderRadius: 12,
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  background: '#fff',
};
const titleStyle: React.CSSProperties = { margin: '0 0 8px', color: '#1e293b', fontSize: 22 };
const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: 14,
  outline: 'none',
};
const btnStyle: React.CSSProperties = {
  padding: '11px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 4,
};
const errorStyle: React.CSSProperties = { color: '#ef4444', fontSize: 13, margin: 0 };
