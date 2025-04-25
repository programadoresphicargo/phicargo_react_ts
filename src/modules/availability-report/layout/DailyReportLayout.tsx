import { ErrorBoundary } from '@/components/utils/ErrorBoundary';
import Header from '../components/ui/Header';
import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface Props {
  children: ReactNode;
}

const DailyReportLayout = ({ children }: Props) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <main className="flex-grow w-full">
        <ErrorBoundary>
          {children}
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  );
};

export default DailyReportLayout;
