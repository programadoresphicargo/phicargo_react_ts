import { ErrorBoundary } from '../../core/utilities/error-boundary';
import { Header } from '../components/ui/Header';
import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface Props {
  children: ReactNode;
}

const ShiftsLayout = ({ children }: Props) => {
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

export default ShiftsLayout;

