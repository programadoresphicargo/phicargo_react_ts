import { Navigate, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { DashboardsLayout } from '../layouts/DashboardsLayout';
import { LoadingPage } from '../../core/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';

const OperationsDashboardPage = lazy(
  () => import('../pages/OperationsDashboardPage'),
);

const permission = 203;

const DashboardsRoutes = () => (
  <Route
    path="/dashboards"
    element={
      <ProtectedRoute
        element={<DashboardsLayout />}
        requiredPermissionId={permission}
      />
    }
  >
    <Route index element={<Navigate to="operaciones" />} />
    <Route
      path="operaciones"
      element={
        <Suspense fallback={<LoadingPage />}>
          <OperationsDashboardPage />
        </Suspense>
      }
    />
  </Route>
);

export default DashboardsRoutes;

