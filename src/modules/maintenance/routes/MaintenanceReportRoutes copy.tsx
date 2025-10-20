import { Suspense, lazy } from 'react';

import { LoadingPage } from '@/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';
import { Route } from 'react-router-dom';

const MaintenanceReportPageRemolques = lazy(
  () => import('../pages/MaintenanceReportPage'),
);

const MaintenanceReportRoutesRemolques = () => (
  <Route
    path="remolques"
    element={
      <ProtectedRoute
        element={
          <Suspense fallback={<LoadingPage />}>
            <MaintenanceReportPageRemolques title={'remolques'} />
          </Suspense>
        }
        requiredPermissionId={198}
      />
    }
  ></Route>
);

export default MaintenanceReportRoutesRemolques;

