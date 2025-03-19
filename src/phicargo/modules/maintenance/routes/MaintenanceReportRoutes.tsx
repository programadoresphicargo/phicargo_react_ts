import { Suspense, lazy } from 'react';

import { LoadingPage } from '@/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';
import { Route } from 'react-router-dom';

const MaintenanceReportPage = lazy(
  () => import('../pages/MaintenanceReportPage'),
);
const RecordDetails = lazy(() => import('../outlets/RecordDetails'));
const CreateNewRecord = lazy(() => import('../outlets/CreateNewRecord'));

const MaintenanceReportRoutes = () => (
  <Route
    path="mantenimiento"
    element={
      <ProtectedRoute
        element={
          <Suspense fallback={<LoadingPage />}>
            <MaintenanceReportPage />
          </Suspense>
        }
        requiredPermissionId={198}
      />
    }
  >
    <Route
      path="detalles/:id"
      element={
        <Suspense fallback={null}>
          <RecordDetails />
        </Suspense>
      }
    />
    <Route
      path="nuevo"
      element={
        <Suspense fallback={null}>
          <CreateNewRecord />
        </Suspense>
      }
    />
  </Route>
);

export default MaintenanceReportRoutes;

