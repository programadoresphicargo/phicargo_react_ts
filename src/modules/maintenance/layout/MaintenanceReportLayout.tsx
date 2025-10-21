import { ErrorBoundary } from '@/components/utils/ErrorBoundary';
import Header from '../components/ui/Header';
import { MaintenanceRecordStatus } from '../models';
import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface Props {
  children: ReactNode;
  type: "tractocamion" | "remolques",
  status: MaintenanceRecordStatus;
}

const MaintenanceReportLayout = ({ children, type, status }: Props) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Header status={status} type={type} />
      <main className="flex-grow w-full p-2">
        <ErrorBoundary>
          {children}
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  );
};

export default MaintenanceReportLayout;

