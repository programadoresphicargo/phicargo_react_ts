import { ErrorBoundary } from '@/components/utils/ErrorBoundary';
import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from '../ui/Header';
import { IncidentsProvider } from '../../context/IncidentsContext';

interface Props {
  children?: ReactNode;
}

const IncidentsLayout = ({ children }: Props) => {
  return (
    <>
      <IncidentsProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Header />
        <main className="flex-grow w-full">
          <ErrorBoundary>
            {children}
            <Outlet />
          </ErrorBoundary>
        </main>
      </IncidentsProvider>
    </>
  );
};

export default IncidentsLayout;

