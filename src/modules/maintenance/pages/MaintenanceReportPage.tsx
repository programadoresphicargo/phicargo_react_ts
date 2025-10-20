import type { MaintenanceRecordStatus } from '../models';
import MaintenanceReportLayout from '../layout/MaintenanceReportLayout';
import MaintenanceReportTable from '../components/table/MaintenanceReportTable';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

interface MaintenanceReportPageProps {
  title:  'tractocamion' | 'remolques' ;
}

const MaintenanceReportPage = ({ title }: MaintenanceReportPageProps) => {
  const [status, setStatus] = useState<MaintenanceRecordStatus>('pending');

  return (
    <MaintenanceReportLayout status={status}>
      <MaintenanceReportTable
        type={title}
        status={status}
        setStatus={setStatus}
      />
      <Outlet />
    </MaintenanceReportLayout>
  );
};

export default MaintenanceReportPage;
