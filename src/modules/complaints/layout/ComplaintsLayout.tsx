import { ErrorBoundary } from '@/components/utils/ErrorBoundary';
import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import CustomNavbar from '@/pages/CustomNavbar';
import { pages } from './pages';

interface Props {
  children?: ReactNode;
}

const ComplaintsLayout = ({ children }: Props) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <CustomNavbar pages={pages}></CustomNavbar>
      <main className="flex-grow w-full">
        <ErrorBoundary>
          {children}
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  );
};

export default ComplaintsLayout;

