import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';

const DailyOperationsPage = lazy(() => import('../pages/DailyOperationsPage'));

const DOReportRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute
            element={
              <Suspense fallback={<LoadingPage />}>
                <DailyOperationsPage />
              </Suspense>
            }
            requiredPermissionId={201}
          />
        }
      />
    </Routes>
  );
};

export default DOReportRoutes;

