import type { MaintenanceRecordStatus } from '../models';
import MaintenanceReportLayout from '../layout/MaintenanceReportLayout';
import MaintenanceReportTable from '../components/table/MaintenanceReportTable';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const MaintenanceReportPage = () => {
  const [status, setStatus] = useState<MaintenanceRecordStatus>('pending');

  return (
    <MaintenanceReportLayout status={status}>
      <MaintenanceReportTable
        status={status}
        setStatus={setStatus}
      />
      <Outlet />
    </MaintenanceReportLayout>
  );
};

export default MaintenanceReportPage;
