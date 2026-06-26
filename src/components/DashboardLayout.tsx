import { useNavigate } from 'react-router-dom';

interface Props {
  title: string;
  role: string;
  navItems: { label: string; path: string }[];
  children: React.ReactNode;
}

export default function DashboardLayout({ title, role, navItems, children }: Props) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <aside style={sidebarStyle}>
        <div style={{ padding: '24px 20px 12px' }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 4 }}>TeleCare</div>
          <div style={{ fontSize: 12, color: '#93c5fd', marginBottom: 24 }}>{role}</div>
          <nav>
            {navItems.map((item) => (
              <button key={item.path} onClick={() => navigate(item.path)} style={navBtnStyle}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={logout} style={logoutBtnStyle}>Sign Out</button>
      </aside>
      <main style={{ flex: 1, background: '#f1f5f9', padding: 32 }}>
        <h1 style={{ margin: '0 0 24px', color: '#1e293b', fontSize: 24 }}>{title}</h1>
        {children}
      </main>
    </div>
  );
}

const sidebarStyle: React.CSSProperties = {
  width: 220,
  background: '#1e40af',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};
const navBtnStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px 14px',
  background: 'transparent',
  color: '#bfdbfe',
  border: 'none',
  borderRadius: 8,
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: 14,
  marginBottom: 2,
};
const logoutBtnStyle: React.CSSProperties = {
  margin: 16,
  padding: '10px 14px',
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};
