import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';
import { Route } from 'react-router-dom';

const DailyOperationsPage = lazy(() => import('../pages/DailyOperationsPage'));

const DOReportRoutes = () => (
  <Route
    path="operaciones"
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
);

export default DOReportRoutes;

