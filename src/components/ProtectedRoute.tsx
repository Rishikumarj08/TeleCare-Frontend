import { Navigate } from 'react-router-dom';
import type { Role } from '../features/authentication/types';

interface Props {
  allowedRole: Role;
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRole, children }: Props) {
  const raw = localStorage.getItem('user');
  if (!raw || !localStorage.getItem('token')) return <Navigate to="/login" replace />;
  const user = JSON.parse(raw);
  if (user.role !== allowedRole) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
