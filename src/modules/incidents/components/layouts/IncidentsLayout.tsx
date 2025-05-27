import { ErrorBoundary } from '@/components/utils/ErrorBoundary';
import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from '../ui/Header';

interface Props {
  children?: ReactNode;
}

const IncidentsLayout = ({ children }: Props) => {
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

export default IncidentsLayout;

