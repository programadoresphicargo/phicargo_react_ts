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
const DIRECTION_INCIDENTS_PERMISSION = 215;
const VEHICLE_INSPECTION_PERMISSION = 216;

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
        <ProtectedRoute
          element={
            <Suspense fallback={<LoadingPage />}>
              <DirectionIncidentsPage />
            </Suspense>
          }
          requiredPermissionId={DIRECTION_INCIDENTS_PERMISSION}
        />
      }
    ></Route>
    <Route
      path="inspeccion-unidades"
      element={
        <ProtectedRoute
          element={
            <Suspense fallback={<LoadingPage />}>
              <VehicleInspectionPage />
            </Suspense>
          }
          requiredPermissionId={VEHICLE_INSPECTION_PERMISSION}
        />
      }
    ></Route>
  </Route>
);

export default IncidentsRoutes;

