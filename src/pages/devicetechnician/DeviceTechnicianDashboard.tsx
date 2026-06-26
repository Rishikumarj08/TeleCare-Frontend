import { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ResourceTable from '../../components/ResourceTable';
import { useDevices } from '../../features/devicetechnician';

const NAV = [{ label: 'Devices', path: '/devicetechnician/dashboard' }];

export default function DeviceTechnicianDashboard() {
  const { devices, loading, error, filter } = useDevices();

  useEffect(() => { filter({}); }, []);

  return (
    <DashboardLayout title="Device Technician Dashboard" role="DeviceTechnician" navItems={NAV}>
      <ResourceTable
        title="Devices"
        data={devices}
        loading={loading}
        error={error}
      />
    </DashboardLayout>
  );
}
