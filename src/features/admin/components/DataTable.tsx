interface Props {
  title: string;
  data: Record<string, unknown>[];
  columns: string[];
}

export default function DataTable({ title, data, columns }: Props) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ color: '#1e293b', marginBottom: 12 }}>{title}</h3>
      {data.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No records found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} style={thStyle}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                  {columns.map((col) => (
                    <td key={col} style={tdStyle}>
                      {String(row[col.toLowerCase()] ?? row[col] ?? '—')}
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

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14,
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  overflow: 'hidden',
};
const thStyle: React.CSSProperties = {
  padding: '10px 14px',
  background: '#2563eb',
  color: '#fff',
  textAlign: 'left',
  fontWeight: 600,
};
const tdStyle: React.CSSProperties = {
  padding: '9px 14px',
  borderBottom: '1px solid #e2e8f0',
  color: '#334155',
};
