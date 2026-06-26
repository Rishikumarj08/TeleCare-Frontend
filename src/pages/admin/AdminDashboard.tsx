import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ResourceTable from '../../components/ResourceTable';
import AddUserModal from '../../features/admin/components/AddUserModal';
import {
  useUsers,
  useCharges,
  useClaims,
  usePayments,
  useRules,
  useAdminNotifications,
} from '../../features/admin';

const NAV = [
  { label: 'Users', path: '/admin/dashboard' },
  { label: 'Charges', path: '/admin/dashboard' },
  { label: 'Claims', path: '/admin/dashboard' },
  { label: 'Payments', path: '/admin/dashboard' },
  { label: 'Rules', path: '/admin/dashboard' },
  { label: 'Notifications', path: '/admin/dashboard' },
];

type Tab = 'Users' | 'Charges' | 'Claims' | 'Payments' | 'Rules' | 'Notifications';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('Users');
  const [showAddUser, setShowAddUser] = useState(false);

  const users = useUsers();
  const charges = useCharges();
  const claims = useClaims();
  const payments = usePayments();
  const rules = useRules();
  const notifications = useAdminNotifications();

  const resources: Record<Tab, ReturnType<typeof useUsers>> = {
    Users: users,
    Charges: charges,
    Claims: claims,
    Payments: payments,
    Rules: rules,
    Notifications: notifications,
  };

  const current = resources[tab];

  return (
    <DashboardLayout title="Administrator Dashboard" role="Administrator" navItems={NAV}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {(Object.keys(resources) as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={tab === t ? activeTabStyle : tabStyle}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Users' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <button style={addBtnStyle} onClick={() => setShowAddUser(true)}>
            + Add User
          </button>
        </div>
      )}

      <ResourceTable
        title={tab}
        data={current.data as Record<string, unknown>[]}
        loading={current.loading}
        error={current.error}
      />

      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onSuccess={() => users.reload()}
        />
      )}
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
const addBtnStyle: React.CSSProperties = {
  padding: '9px 20px', background: '#16a34a', color: '#fff',
  border: 'none', borderRadius: 7, fontWeight: 600, cursor: 'pointer', fontSize: 14,
};
