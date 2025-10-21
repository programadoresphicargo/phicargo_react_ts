import type { MaintenanceRecordStatus } from '../models';
import MaintenanceReportLayout from '../layout/MaintenanceReportLayout';
import MaintenanceReportTable from '../components/table/MaintenanceReportTable';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import type { MenuItemType } from '@/types';

interface MaintenanceReportPageProps {
  title: 'tractocamion' | 'remolques';
}

const pages: MenuItemType[] = [
  {
    name: 'Tractos',
    path: '/reportes/mantenimiento',
    exact: true,
    requiredPermissions: [],
  },
  {
    name: 'Remolques',
    path: '/reportes/remolques',
    requiredPermissions: [],
  },
];

const MaintenanceReportPage = ({ title }: MaintenanceReportPageProps) => {
  const [status, setStatus] = useState<MaintenanceRecordStatus>('pending');

  return (
    <BaseLayout pages={pages}>
      <MaintenanceReportLayout status={status} type={title}>
        <MaintenanceReportTable
          type={title}
          status={status}
          setStatus={setStatus}
        />
        <Outlet />
      </MaintenanceReportLayout>
    </BaseLayout>
  );
};

export default MaintenanceReportPage;
