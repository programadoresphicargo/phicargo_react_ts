import { Suspense, lazy } from 'react';

import { LoadingPage } from '@/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';
import { Route } from 'react-router-dom';

const MaintenanceReportPage = lazy(
  () => import('../pages/MaintenanceReportPage'),
);

const MaintenanceReportRoutes = () => (
  <Route
    path="mantenimiento"
    element={
      <ProtectedRoute
        element={
          <Suspense fallback={<LoadingPage />}>
            <MaintenanceReportPage title={'tractocamion'} />
          </Suspense>
        }
        requiredPermissionId={198}
      />
    }
  ></Route>
);

export default MaintenanceReportRoutes;

