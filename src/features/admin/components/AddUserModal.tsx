import { useState } from 'react';
import { createUser } from '../services/adminService';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = ['Administrator', 'Patient', 'Clinician', 'CareCoordinator', 'DeviceTechnician', 'Auditor'];

const initialForm = { name: '', email: '', phone: '', password: '', roleName: 'Patient', pin: '' };

export default function AddUserModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: Record<string, string> = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        roleName: form.roleName,
      };
      if (form.roleName === 'Clinician' && form.pin) payload.pin = form.pin;
      await createUser(payload);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>Add User</h3>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Name">
            <input style={inputStyle} name="name" value={form.name} onChange={onChange} required />
          </Field>
          <Field label="Email">
            <input style={inputStyle} name="email" type="email" value={form.email} onChange={onChange} required />
          </Field>
          <Field label="Phone">
            <input style={inputStyle} name="phone" value={form.phone} onChange={onChange} required />
          </Field>
          <Field label="Password">
            <input style={inputStyle} name="password" type="password" value={form.password} onChange={onChange} required />
          </Field>
          <Field label="Role">
            <select style={inputStyle} name="roleName" value={form.roleName} onChange={onChange}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          {form.roleName === 'Clinician' && (
            <Field label="PIN (required for Clinician)">
              <input style={inputStyle} name="pin" value={form.pin} onChange={onChange} required />
            </Field>
          )}

          {error && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" style={submitBtnStyle} disabled={loading}>
              {loading ? 'Saving…' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{label}</label>
    {children}
  </div>
);

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
};
const modalStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 12, padding: 28, width: 420,
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)', maxHeight: '90vh', overflowY: 'auto',
};
const inputStyle: React.CSSProperties = {
  padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 7,
  fontSize: 14, outline: 'none', width: '100%',
};
const closeBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#94a3b8',
};
const submitBtnStyle: React.CSSProperties = {
  padding: '9px 22px', background: '#1e40af', color: '#fff',
  border: 'none', borderRadius: 7, fontWeight: 600, cursor: 'pointer', fontSize: 14,
};
const cancelBtnStyle: React.CSSProperties = {
  padding: '9px 22px', background: '#f1f5f9', color: '#475569',
  border: '1px solid #e2e8f0', borderRadius: 7, cursor: 'pointer', fontSize: 14,
};
