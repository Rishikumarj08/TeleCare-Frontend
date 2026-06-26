import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import type { RegisterRequest } from '../types';

const ROLES: Array<'Patient' | 'Administrator'> = ['Patient', 'Administrator'];

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register, loading, error, success } = useRegister();

  const [form, setForm] = useState<RegisterRequest>({
    name: '', email: '', phone: '', password: '', roleName: 'Patient',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const selectRole = (role: 'Patient' | 'Administrator') =>
    setForm((p) => ({ ...p, roleName: role }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      setPwError('Passwords do not match.');
      return;
    }
    setPwError(null);
    register(form);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {/* Title */}
      <div style={{ marginBottom: 4 }}>
        <h2 style={titleStyle}>Create Account</h2>
        <p style={subtitleStyle}>Register as a Patient or Administrator</p>
      </div>

      {/* Role toggle */}
      <div style={roleToggleWrapper}>
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => selectRole(r)}
            style={form.roleName === r ? roleActiveBtnStyle : roleBtnStyle}
          >
            {r === 'Patient' ? '🧑‍⚕️ Patient' : '🛡️ Administrator'}
          </button>
        ))}
      </div>

      {/* Fields */}
      <Field label="Full Name">
        <input style={inputStyle} name="name" placeholder="John Doe" value={form.name} onChange={onChange} required />
      </Field>
      <Field label="Email">
        <input style={inputStyle} name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
      </Field>
      <Field label="Phone">
        <input style={inputStyle} name="phone" placeholder="555-1234" value={form.phone} onChange={onChange} required />
      </Field>
      <Field label="Password">
        <input style={inputStyle} name="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={onChange} required minLength={8} />
      </Field>
      <Field label="Confirm Password">
        <input
          style={{ ...inputStyle, borderColor: pwError ? '#ef4444' : '#e2e8f0' }}
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </Field>

      {/* Errors / success */}
      {pwError  && <p style={errorStyle}>{pwError}</p>}
      {error    && <p style={errorStyle}>{error}</p>}
      {success  && <p style={successStyle}>✓ Registered successfully! Redirecting to login…</p>}

      <button style={submitBtnStyle} type="submit" disabled={loading || success}>
        {loading ? 'Creating account…' : 'Register'}
      </button>

      <p style={footerStyle}>
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} style={linkStyle}>Sign in</span>
      </p>
    </form>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{label}</label>
    {children}
  </div>
);

const formStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 14,
  width: 400, padding: 36, borderRadius: 14,
  boxShadow: '0 4px 28px rgba(0,0,0,0.13)', background: '#fff',
};
const titleStyle:    React.CSSProperties = { margin: 0, color: '#1e293b', fontSize: 22, fontWeight: 700 };
const subtitleStyle: React.CSSProperties = { margin: '4px 0 0', color: '#64748b', fontSize: 13 };
const inputStyle:    React.CSSProperties = {
  padding: '10px 13px', border: '1px solid #e2e8f0',
  borderRadius: 8, fontSize: 14, outline: 'none', width: '100%',
};
const roleToggleWrapper: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
};
const roleBtnStyle: React.CSSProperties = {
  padding: '9px', border: '1.5px solid #e2e8f0', borderRadius: 8,
  background: '#f8fafc', color: '#475569', cursor: 'pointer', fontSize: 13, fontWeight: 500,
};
const roleActiveBtnStyle: React.CSSProperties = {
  ...roleBtnStyle, border: '1.5px solid #1e40af',
  background: '#eff6ff', color: '#1e40af', fontWeight: 700,
};
const submitBtnStyle: React.CSSProperties = {
  padding: '11px', background: '#1e40af', color: '#fff',
  border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
  cursor: 'pointer', marginTop: 2,
};
const errorStyle:   React.CSSProperties = { color: '#ef4444', fontSize: 13, margin: 0 };
const successStyle: React.CSSProperties = { color: '#16a34a', fontSize: 13, margin: 0 };
const footerStyle:  React.CSSProperties = { textAlign: 'center', fontSize: 13, color: '#64748b', margin: 0 };
const linkStyle:    React.CSSProperties = { color: '#1e40af', fontWeight: 600, cursor: 'pointer' };
