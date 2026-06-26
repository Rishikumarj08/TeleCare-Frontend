import { useState, useEffect } from 'react';
import { usePatientProfile } from '../hooks/usePatientProfile';

interface Props { userId: number; }

const GENDERS = ['Male', 'Female', 'Other'];
const LANGUAGES = ['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Other'];
const RELATIONS = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other'];

interface ContactFields   { phone: string; email: string; }
interface EmergencyFields { name: string; phone: string; relation: string; }

const blankContact:   ContactFields   = { phone: '', email: '' };
const blankEmergency: EmergencyFields = { name: '', phone: '', relation: 'Spouse' };

const safeParseContact = (raw: string): ContactFields => {
  try { const p = JSON.parse(raw); return { phone: p.phone ?? '', email: p.email ?? '' }; }
  catch { return blankContact; }
};
const safeParseEmergency = (raw: string): EmergencyFields => {
  try { const p = JSON.parse(raw); return { name: p.name ?? '', phone: p.phone ?? '', relation: p.relation ?? 'Spouse' }; }
  catch { return blankEmergency; }
};

export default function PatientProfile({ userId }: Props) {
  const { profile, loading, error, saving, saveError, saveSuccess, create, update } = usePatientProfile(userId);
  const [isEditing, setIsEditing] = useState(false);

  // ── Create form state ──────────────────────────────────────────────────────
  const [cf, setCf] = useState({
    mrn: '', name: '', dob: '', gender: 'Male',
    address: '', primaryLanguage: 'English',
    consentStatus: false, enrolledProgramsJSON: '[]',
  });
  const [cfContact,   setCfContact]   = useState<ContactFields>(blankContact);
  const [cfEmergency, setCfEmergency] = useState<EmergencyFields>(blankEmergency);

  // ── Update form state ──────────────────────────────────────────────────────
  const [uf, setUf] = useState({ name: '', address: '' });
  const [ufContact,   setUfContact]   = useState<ContactFields>(blankContact);
  const [ufEmergency, setUfEmergency] = useState<EmergencyFields>(blankEmergency);

  useEffect(() => {
    if (profile) {
      setUf({ name: profile.name, address: profile.address });
      setUfContact(safeParseContact(profile.contactInfoJSON));
      setUfEmergency(safeParseEmergency(profile.emergencyContactJSON));
      setIsEditing(false);
    }
  }, [profile]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const onCf = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setCf((p) => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    create({
      ...cf,
      userID: userId,
      contactInfoJSON:   JSON.stringify(cfContact),
      emergencyContactJSON: JSON.stringify(cfEmergency),
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    update(profile.patientID, {
      patientID: profile.patientID,
      ...uf,
      contactInfoJSON:      JSON.stringify(ufContact),
      emergencyContactJSON: JSON.stringify(ufEmergency),
    });
  };

  const handleEditOpen = () => {
    setUf({ name: profile!.name, address: profile!.address });
    setUfContact(safeParseContact(profile!.contactInfoJSON));
    setUfEmergency(safeParseEmergency(profile!.emergencyContactJSON));
    setIsEditing(true);
  };

  if (loading) return <Card><p style={{ color: '#64748b' }}>Loading profile…</p></Card>;
  if (error)   return <Card><p style={{ color: '#ef4444' }}>{error}</p></Card>;

  // ── VIEW: profile exists ───────────────────────────────────────────────────
  if (profile) {
    const contact   = safeParseContact(profile.contactInfoJSON);
    const emergency = safeParseEmergency(profile.emergencyContactJSON);

    return (
      <Card>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: '0 0 6px', color: '#1e293b' }}>{profile.name}</h2>
            <Badge>MRN: {profile.mrn}</Badge>
            <Badge color="green">{['Active', 'Inactive', 'Discharged'][profile.status] ?? profile.status}</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ textAlign: 'right', fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
              <div>DOB: <b>{new Date(profile.dob).toLocaleDateString()}</b></div>
              <div>Gender: <b>{profile.gender}</b></div>
              <div>Language: <b>{profile.primaryLanguage}</b></div>
              <div>Consent: <b>{profile.consentStatus ? 'Yes' : 'No'}</b></div>
            </div>
            {!isEditing && (
              <button onClick={handleEditOpen} title="Edit Profile" style={editIconBtnStyle}>
                ✏️
              </button>
            )}
          </div>
        </div>

        {/* Info grid — always visible */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <InfoCard title="Contact Information">
            <InfoRow label="Phone" value={contact.phone} />
            <InfoRow label="Email" value={contact.email} />
          </InfoCard>
          <InfoCard title="Emergency Contact">
            <InfoRow label="Name"     value={emergency.name} />
            <InfoRow label="Phone"    value={emergency.phone} />
            <InfoRow label="Relation" value={emergency.relation} />
          </InfoCard>
        </div>

        {/* Edit form — only shown when pencil clicked */}
        {isEditing && (
          <>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 0 24px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: 16 }}>Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} style={cancelIconBtnStyle}>✕ Cancel</button>
            </div>
            <form onSubmit={handleUpdate} style={formGrid}>
              <Field label="Full Name">
                <input style={inputStyle} value={uf.name} onChange={(e) => setUf((p) => ({ ...p, name: e.target.value }))} required />
              </Field>
              <Field label="Address">
                <input style={inputStyle} value={uf.address} onChange={(e) => setUf((p) => ({ ...p, address: e.target.value }))} required />
              </Field>

              <SectionLabel>Contact Information</SectionLabel>
              <Field label="Phone">
                <input style={inputStyle} value={ufContact.phone} onChange={(e) => setUfContact((p) => ({ ...p, phone: e.target.value }))} required />
              </Field>
              <Field label="Email">
                <input style={inputStyle} type="email" value={ufContact.email} onChange={(e) => setUfContact((p) => ({ ...p, email: e.target.value }))} required />
              </Field>

              <SectionLabel>Emergency Contact</SectionLabel>
              <Field label="Name">
                <input style={inputStyle} value={ufEmergency.name} onChange={(e) => setUfEmergency((p) => ({ ...p, name: e.target.value }))} required />
              </Field>
              <Field label="Phone">
                <input style={inputStyle} value={ufEmergency.phone} onChange={(e) => setUfEmergency((p) => ({ ...p, phone: e.target.value }))} required />
              </Field>
              <Field label="Relation">
                <select style={inputStyle} value={ufEmergency.relation} onChange={(e) => setUfEmergency((p) => ({ ...p, relation: e.target.value }))}>
                  {RELATIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>

              {saveError   && <p style={{ color: '#ef4444', fontSize: 13, gridColumn: '1/-1' }}>{saveError}</p>}
              {saveSuccess && <p style={{ color: '#16a34a', fontSize: 13, gridColumn: '1/-1' }}>Profile updated successfully.</p>}
              <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" style={submitBtnStyle} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </form>
          </>
        )}
      </Card>
    );
  }

  // ── CREATE: no profile yet ─────────────────────────────────────────────────
  return (
    <Card>
      <h3 style={{ margin: '0 0 20px', color: '#1e293b', fontSize: 16 }}>Complete Your Profile</h3>
      <form onSubmit={handleCreate} style={formGrid}>
        <Field label="MRN">
          <input style={inputStyle} name="mrn" value={cf.mrn} onChange={onCf} required />
        </Field>
        <Field label="Full Name">
          <input style={inputStyle} name="name" value={cf.name} onChange={onCf} required />
        </Field>
        <Field label="Date of Birth">
          <input style={inputStyle} name="dob" type="date" value={cf.dob} onChange={onCf} required />
        </Field>
        <Field label="Gender">
          <select style={inputStyle} name="gender" value={cf.gender} onChange={onCf}>
            {GENDERS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Address" span>
          <input style={inputStyle} name="address" value={cf.address} onChange={onCf} required />
        </Field>
        <Field label="Primary Language">
          <select style={inputStyle} name="primaryLanguage" value={cf.primaryLanguage} onChange={onCf}>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Consent">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10 }}>
            <input type="checkbox" name="consentStatus" checked={cf.consentStatus} onChange={onCf} style={{ width: 16, height: 16 }} />
            I give consent for telecare services
          </label>
        </Field>

        <SectionLabel>Contact Information</SectionLabel>
        <Field label="Phone">
          <input style={inputStyle} value={cfContact.phone} onChange={(e) => setCfContact((p) => ({ ...p, phone: e.target.value }))} required />
        </Field>
        <Field label="Email">
          <input style={inputStyle} type="email" value={cfContact.email} onChange={(e) => setCfContact((p) => ({ ...p, email: e.target.value }))} required />
        </Field>

        <SectionLabel>Emergency Contact</SectionLabel>
        <Field label="Name">
          <input style={inputStyle} value={cfEmergency.name} onChange={(e) => setCfEmergency((p) => ({ ...p, name: e.target.value }))} required />
        </Field>
        <Field label="Phone">
          <input style={inputStyle} value={cfEmergency.phone} onChange={(e) => setCfEmergency((p) => ({ ...p, phone: e.target.value }))} required />
        </Field>
        <Field label="Relation">
          <select style={inputStyle} value={cfEmergency.relation} onChange={(e) => setCfEmergency((p) => ({ ...p, relation: e.target.value }))}>
            {RELATIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>

        {saveError   && <p style={{ color: '#ef4444', fontSize: 13, gridColumn: '1/-1' }}>{saveError}</p>}
        {saveSuccess && <p style={{ color: '#16a34a', fontSize: 13, gridColumn: '1/-1' }}>Profile created successfully.</p>}
        <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" style={submitBtnStyle} disabled={saving}>{saving ? 'Saving…' : 'Create Profile'}</button>
        </div>
      </form>
    </Card>
  );
}

// ── Small helper components ────────────────────────────────────────────────────
const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
    {children}
  </div>
);

const Badge = ({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'green' }) => (
  <span style={{
    display: 'inline-block', padding: '3px 10px', borderRadius: 20, marginRight: 6, fontSize: 12, fontWeight: 600,
    background: color === 'green' ? '#dcfce7' : '#eff6ff',
    color: color === 'green' ? '#16a34a' : '#1e40af',
  }}>{children}</span>
);

const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 18px', border: '1px solid #e2e8f0' }}>
    <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: 13, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
    {children}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
    <span style={{ color: '#64748b' }}>{label}</span>
    <span style={{ color: '#1e293b', fontWeight: 500 }}>{value || '—'}</span>
  </div>
);

const Field = ({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: span ? '1/-1' : undefined }}>
    <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{label}</label>
    {children}
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ gridColumn: '1/-1', borderTop: '1px solid #e2e8f0', paddingTop: 16, marginTop: 4, fontWeight: 600, fontSize: 13, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
    {children}
  </div>
);

const formGrid:        React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
const inputStyle:      React.CSSProperties = { padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 14, outline: 'none', width: '100%' };
const submitBtnStyle:  React.CSSProperties = { padding: '10px 28px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 7, fontWeight: 600, cursor: 'pointer', fontSize: 14 };
const editIconBtnStyle: React.CSSProperties = { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 16, lineHeight: 1 };
const cancelIconBtnStyle: React.CSSProperties = { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 7, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 };
