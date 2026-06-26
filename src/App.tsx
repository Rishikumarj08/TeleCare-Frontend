import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import ClinicianDashboard from './pages/clinician/ClinicianDashboard';
import CareCoordinatorDashboard from './pages/carecoordinator/CareCoordinatorDashboard';
import DeviceTechnicianDashboard from './pages/devicetechnician/DeviceTechnicianDashboard';
import AuditorDashboard from './pages/auditor/AuditorDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="Administrator">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRole="Patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinician/dashboard"
          element={
            <ProtectedRoute allowedRole="Clinician">
              <ClinicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carecoordinator/dashboard"
          element={
            <ProtectedRoute allowedRole="CareCoordinator">
              <CareCoordinatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/devicetechnician/dashboard"
          element={
            <ProtectedRoute allowedRole="DeviceTechnician">
              <DeviceTechnicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auditor/dashboard"
          element={
            <ProtectedRoute allowedRole="Auditor">
              <AuditorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
