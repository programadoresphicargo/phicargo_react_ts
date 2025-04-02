import { ErrorBoundary } from '@/components/utils/ErrorBoundary';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import WeekProvider from '../context/week-context/WeekProvider';

interface BaseLayoutProps {
  children?: React.ReactNode;
}

const CashflowLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <WeekProvider>
        <Header />
        <main className="flex-grow w-full">
          <ErrorBoundary>
            {children}
            <Outlet />
          </ErrorBoundary>
        </main>
      </WeekProvider>
    </>
  );
};

export default CashflowLayout;
