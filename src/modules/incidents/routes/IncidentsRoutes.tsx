import { Suspense, lazy } from 'react';

import { LoadingPage } from '@/pages/LoadingPage';
import { Route } from 'react-router-dom';
import IncidentsLayout from '../components/layouts/IncidentsLayout';
import ProtectedRoute from '@/router/ProtectedRoute';

const IncidentsPage = lazy(() => import('../pages/IncidentsPage'));
const DirectionIncidentsPage = lazy(
  () => import('../pages/DirectionIncidentsPage'),
);
const VehicleInspectionPage = lazy(
  () => import('../pages/VehicleInspectionPage'),
);

const INCIDENTS_PERMISSION = 214;

const IncidentsRoutes = () => (
  <Route
    path="/incidencias"
    element={
      <ProtectedRoute
        element={<IncidentsLayout />}
        requiredPermissionId={INCIDENTS_PERMISSION}
      />
    }
  >
    <Route
      path=""
      element={
        <Suspense fallback={<LoadingPage />}>
          <IncidentsPage />
        </Suspense>
      }
    ></Route>
    <Route
      path="direccion"
      element={
        <Suspense fallback={<LoadingPage />}>
          <DirectionIncidentsPage />
        </Suspense>
      }
    ></Route>
    <Route
      path="inspeccion-unidades"
      element={
        <Suspense fallback={<LoadingPage />}>
          <VehicleInspectionPage />
        </Suspense>
      }
    ></Route>
  </Route>
);

export default IncidentsRoutes;

