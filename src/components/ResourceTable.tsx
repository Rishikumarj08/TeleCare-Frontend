interface Props {
  title: string;
  data: Record<string, unknown>[];
  loading: boolean;
  error: string | null;
  onEditStatus?: (row: Record<string, unknown>) => void;
}

export default function ResourceTable({ title, data, loading, error, onEditStatus }: Props) {
  const columns = data.length > 0 ? Object.keys(data[0]).filter(c => !c.startsWith('_')) : [];

  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', marginBottom: 28 }}>
      <h3 style={{ margin: '0 0 14px', color: '#1e293b' }}>{title}</h3>
      {loading && <p style={{ color: '#64748b' }}>Loading…</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {!loading && !error && data.length === 0 && <p style={{ color: '#94a3b8' }}>No records found.</p>}
      {!loading && !error && data.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {columns.map((c) => <th key={c} style={thStyle}>{c}</th>)}
                {onEditStatus && <th style={thStyle}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                  {columns.map((c) => {
                    const val = String(row[c] ?? '—');
                    if (c === 'Join Call' && val.startsWith('JOIN:')) {
                      const url = val.slice(5);
                      return <td key={c} style={tdStyle}><a href={url} target='_blank' rel='noreferrer' style={{ color: '#1e40af', fontWeight: 600 }}>Join Call</a></td>;
                    }
                    return <td key={c} style={tdStyle}>{val}</td>;
                  })}
                  {onEditStatus && (
                    <td style={tdStyle}>
                      <button onClick={() => onEditStatus(row)} style={editBtnStyle}>Edit Status</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 };
const thStyle: React.CSSProperties = { padding: '9px 12px', background: '#1e40af', color: '#fff', textAlign: 'left', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid #e2e8f0', color: '#334155' };
const editBtnStyle: React.CSSProperties = {
  padding: '4px 10px', fontSize: 12, borderRadius: 5, border: '1px solid #1e40af',
  background: '#eff6ff', color: '#1e40af', cursor: 'pointer',
};
