// src/routes/IncidentsRoutes.tsx
import { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import { LoadingPage } from '@/pages/LoadingPage';
import IncidentsLayout from '../components/layouts/IncidentsLayout';
import ProtectedRoute from '@/router/ProtectedRoute';
import IncidentsRedirect from '../routes/IncidentsRedirect';

const IncidentsPage = lazy(() => import('../pages/IncidentsPage'));
const DirectionIncidentsPage = lazy(() => import('../pages/DirectionIncidentsPage'));
const VehicleInspectionPage = lazy(() => import('../pages/VehicleInspectionPage'));
const VehicleLegalInspectionPage = lazy(() => import('../pages/VehicleLegalInspectionPage'));

const INCIDENTS_PERMISSION = 214;
const DIRECTION_INCIDENTS_PERMISSION = 215;
const VEHICLE_INSPECTION_PERMISSION_SECURITY = 216;
const VEHICLE_INSPECTION_PERMISSION_LEGAL = 217;

const IncidentsRoutes = () => (
  <Route
    path="/incidencias"
    element={
      <ProtectedRoute
        element={<IncidentsLayout />}
        requiredPermissionId={0} // Permitir acceso al layout sin permisos específicos
      />
    }
  >
    {/* Redirigir automáticamente a la primera subruta visible */}
    <Route index element={<IncidentsRedirect />} />

    <Route
      path="incidencias"
      element={
        <ProtectedRoute
          element={
            <Suspense fallback={<LoadingPage />}>
              <IncidentsPage />
            </Suspense>
          }
          requiredPermissionId={INCIDENTS_PERMISSION}
        />
      }
    />

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
    />

    <Route
      path="inspeccion-unidades"
      element={
        <ProtectedRoute
          element={
            <Suspense fallback={<LoadingPage />}>
              <VehicleInspectionPage />
            </Suspense>
          }
          requiredPermissionId={VEHICLE_INSPECTION_PERMISSION_SECURITY}
        />
      }
    />

    <Route
      path="inspeccion-unidades-legal"
      element={
        <ProtectedRoute
          element={
            <Suspense fallback={<LoadingPage />}>
              <VehicleLegalInspectionPage />
            </Suspense>
          }
          requiredPermissionId={VEHICLE_INSPECTION_PERMISSION_LEGAL}
        />
      }
    />
  </Route>
);

export default IncidentsRoutes;
