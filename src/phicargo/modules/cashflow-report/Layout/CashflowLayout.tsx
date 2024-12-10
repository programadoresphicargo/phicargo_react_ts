import { ErrorBoundary } from '../../core/utilities/error-boundary';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import ReportProvider from '../context/report-context/ReportProvider';
import { Toaster } from 'react-hot-toast';
import WeekProvider from '../context/week-context/WeekProvider';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const CashflowLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <main className="flex-grow w-full">
        <ErrorBoundary>
          <ReportProvider>
            <WeekProvider>
              {children}
              <Outlet />
            </WeekProvider>
          </ReportProvider>
        </ErrorBoundary>
      </main>
    </>
  );
};

export default CashflowLayout;
