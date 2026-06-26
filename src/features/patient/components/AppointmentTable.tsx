import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

interface RawAppointment {
  AppID: number;
  PatientID: number;
  ClinicianID: number;
  ScheduledAt: string;
  DurationMinutes: number;
  Mode: string;
  LocationURI?: string;
  Status: string;
  CreatedAt: string;
}

interface DisplayAppointment {
  'Clinician Name': string;
  'Scheduled At': string;
  'Duration (mins)': number;
  'Mode': string;
  'Location': string;
  'Status': string;
}

const COLUMNS: (keyof DisplayAppointment)[] = [
  'Clinician Name', 'Scheduled At', 'Duration (mins)', 'Mode', 'Location', 'Status',
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString();
};

type View = 'upcoming' | 'past';

export default function AppointmentTable() {
  const [upcoming, setUpcoming] = useState<DisplayAppointment[]>([]);
  const [past, setPast]         = useState<DisplayAppointment[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [view, setView]         = useState<View>('upcoming');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get<RawAppointment[]>('/api/appointment');
        const appointments = Array.isArray(res.data) ? res.data : [];

        // Load all users once, then build clinician name map client-side
        // GET /api/admin/users works for Administrator; for other roles falls back gracefully
        const uniqueClinicianIds = [...new Set(appointments.map((a) => a.ClinicianID))];
        const clinicianNameMap: Record<number, string> = {};

        try {
          const usersRes = await axiosInstance.get('/api/admin/users');
          const allUsers: { UserID: number; Name: string }[] = Array.isArray(usersRes.data)
            ? usersRes.data
            : [];
          uniqueClinicianIds.forEach((uid) => {
            const found = allUsers.find((u) => u.UserID === uid);
            clinicianNameMap[uid] = found?.Name ?? `Clinician #${uid}`;
          });
        } catch {
          // Fallback: try searching each clinician individually
          await Promise.all(
            uniqueClinicianIds.map(async (uid) => {
              try {
                const r = await axiosInstance.post('/api/admin/users/search', { UserID: uid });
                const list = Array.isArray(r.data) ? r.data : [];
                clinicianNameMap[uid] = list.length > 0
                  ? (list[0].Name ?? list[0].name ?? `Clinician #${uid}`)
                  : `Clinician #${uid}`;
              } catch {
                clinicianNameMap[uid] = `Clinician #${uid}`;
              }
            })
          );
        }

        const now = new Date();

        const toDisplay = (a: RawAppointment): DisplayAppointment => ({
          'Clinician Name':   clinicianNameMap[a.ClinicianID] ?? `Clinician #${a.ClinicianID}`,
          'Scheduled At':    formatDate(a.ScheduledAt),
          'Duration (mins)': a.DurationMinutes,
          'Mode':            a.Mode,
          'Location':        a.LocationURI ?? '—',
          'Status':          a.Status,
        });

        setUpcoming(
          appointments
            .filter((a) => new Date(a.ScheduledAt) >= now || a.Status === 'Scheduled')
            .sort((a, b) => new Date(a.ScheduledAt).getTime() - new Date(b.ScheduledAt).getTime())
            .map(toDisplay)
        );

        setPast(
          appointments
            .filter((a) => new Date(a.ScheduledAt) < now && a.Status !== 'Scheduled')
            .sort((a, b) => new Date(b.ScheduledAt).getTime() - new Date(a.ScheduledAt).getTime())
            .map(toDisplay)
        );
      } catch {
        setError('Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const rows = view === 'upcoming' ? upcoming : past;

  return (
    <div style={wrapperStyle}>

      {/* Toggle buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => setView('upcoming')}
          style={view === 'upcoming' ? activeBtn : inactiveBtn}
        >
          🟢 Upcoming
          <span style={countBadge(view === 'upcoming')}>{loading ? '…' : upcoming.length}</span>
        </button>
        <button
          onClick={() => setView('past')}
          style={view === 'past' ? activePastBtn : inactivePastBtn}
        >
          🕐 Past
          <span style={countBadge(view === 'past')}>{loading ? '…' : past.length}</span>
        </button>
      </div>

      {/* Content */}
      {loading && <p style={{ color: '#64748b' }}>Loading appointments…</p>}
      {error   && <p style={{ color: '#ef4444' }}>{error}</p>}

      {!loading && !error && rows.length === 0 && (
        <p style={{ color: '#94a3b8' }}>
          No {view === 'upcoming' ? 'upcoming' : 'past'} appointments found.
        </p>
      )}

      {!loading && !error && rows.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>{COLUMNS.map((c) => <th key={c} style={thStyle}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                  {COLUMNS.map((c) => (
                    <td key={c} style={tdStyle}>
                      {c === 'Status'
                        ? <StatusBadge status={String(row[c])} />
                        : String(row[c] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Scheduled: { bg: '#eff6ff', color: '#1e40af' },
  Completed: { bg: '#dcfce7', color: '#16a34a' },
  Cancelled: { bg: '#fef2f2', color: '#dc2626' },
  NoShow:    { bg: '#fef9c3', color: '#92400e' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS_COLORS[status] ?? { bg: '#f1f5f9', color: '#475569' };
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      {status}
    </span>
  );
};

const countBadge = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10, marginLeft: 8,
  background: active ? 'rgba(255,255,255,0.3)' : '#e2e8f0',
  color: active ? '#fff' : '#475569',
  fontSize: 11, fontWeight: 700,
});

const baseBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', padding: '9px 18px',
  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
  cursor: 'pointer', transition: 'background 0.15s',
};
const activeBtn:      React.CSSProperties = { ...baseBtn, background: '#16a34a', color: '#fff' };
const inactiveBtn:    React.CSSProperties = { ...baseBtn, background: '#f0fdf4', color: '#16a34a', border: '1.5px solid #bbf7d0' };
const activePastBtn:  React.CSSProperties = { ...baseBtn, background: '#475569', color: '#fff' };
const inactivePastBtn: React.CSSProperties = { ...baseBtn, background: '#f8fafc', color: '#475569', border: '1.5px solid #e2e8f0' };

const wrapperStyle: React.CSSProperties = { background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' };
const tableStyle:   React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 };
const thStyle:      React.CSSProperties = { padding: '9px 12px', background: '#1e40af', color: '#fff', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' };
const tdStyle:      React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid #e2e8f0', color: '#334155' };
