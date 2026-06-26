import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ResourceTable from '../../components/ResourceTable';
import { getAllAuditLogs, getAllKpis, getAllPatientVisits } from '../../features/auditor';

type Tab = 'AuditLogs' | 'KPIs' | 'PatientVisits';
const TABS: Tab[] = ['AuditLogs', 'KPIs', 'PatientVisits'];

export default function AuditorDashboard() {
  const [tab, setTab] = useState<Tab>('AuditLogs');
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchers: Record<Tab, () => Promise<{ data: unknown }>> = {
    AuditLogs: getAllAuditLogs,
    KPIs: getAllKpis,
    PatientVisits: getAllPatientVisits,
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchers[tab]()
      .then((res) => {
        const d = res.data;
        setData(Array.isArray(d) ? d : [d]);
      })
      .catch(() => setError('Failed to load.'))
      .finally(() => setLoading(false));
  }, [tab]);

  const NAV = TABS.map((t) => ({ label: t, path: '/auditor/dashboard' }));

  return (
    <DashboardLayout title="Auditor Dashboard" role="Auditor" navItems={NAV}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={tab === t ? activeTabStyle : tabStyle}>
            {t}
          </button>
        ))}
      </div>
      <ResourceTable title={tab} data={data} loading={loading} error={error} />
    </DashboardLayout>
  );
}

const tabStyle: React.CSSProperties = {
  padding: '8px 18px', border: '1px solid #cbd5e1', borderRadius: 6,
  background: '#fff', cursor: 'pointer', fontSize: 14, color: '#475569',
};
const activeTabStyle: React.CSSProperties = {
  ...tabStyle, background: '#1e40af', color: '#fff', border: '1px solid #1e40af',
};
