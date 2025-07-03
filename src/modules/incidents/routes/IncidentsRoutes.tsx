import { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';

import { LoadingPage } from '@/pages/LoadingPage';
import IncidentsLayout from '../components/layouts/IncidentsLayout';
import ProtectedRoute from '@/router/ProtectedRoute';
import { RedirectToFirstIncidentsPage } from '../constants/RedirectToFirstIncidentsPage';
import {
  INCIDENTS_PERMISSION,
  DIRECTION_INCIDENTS_PERMISSION,
  VEHICLE_INSPECTION_PERMISSION_SECURITY,
  VEHICLE_INSPECTION_PERMISSION_LEGAL,
} from '../constants/incidentsPages';
import { useAuthContext } from '@/modules/auth/hooks';

const IncidentsPage = lazy(() => import('../pages/IncidentsPage'));
const DirectionIncidentsPage = lazy(() => import('../pages/DirectionIncidentsPage'));
const VehicleInspectionPage = lazy(() => import('../pages/VehicleInspectionPage'));
const VehicleLegalInspectionPage = lazy(() => import('../pages/VehicleLegalInspectionPage'));

const IncidentsRoutes = () => {
  const { session } = useAuthContext();
  const permissions = session?.user?.permissions ?? [];

  return (
    <Route
      path="/incidencias"
      element={<ProtectedRoute element={<IncidentsLayout />} />}
    >
      {/* ✅ Redirección automática a primera subruta permitida */}
      <Route path="" element={<RedirectToFirstIncidentsPage permissions={permissions} />} />

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
      <Route
        path=""
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
    </Route>
  );
};

export default IncidentsRoutes;
