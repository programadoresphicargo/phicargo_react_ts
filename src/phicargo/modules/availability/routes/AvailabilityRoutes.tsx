import { Navigate, Route } from 'react-router-dom';
import { Suspense, lazy, memo } from 'react';

import AvailabilityLayout from '../layout/AvailabilityLayout';
import { LoadingPage } from '@/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';

const VehicleAvailabilityPage = lazy(() =>
  import('../pages/VehicleAvailabilityPage').then((module) => ({
    default: memo(module.default),
  })),
);

const DriverAvailabilityPage = lazy(() =>
  import('../pages/DriverAvailabilityPage').then((module) => ({
    default: memo(module.default),
  })),
);
const NotAssignedPage = lazy(() => import('../pages/NotAssignedPage'));
const SummaryPage = lazy(() =>
  import('../pages/SummaryPage').then((module) => ({
    default: memo(module.default),
  })),
);
const DriverSummaryPage = lazy(() =>
  import('../pages/DriverSummaryPage').then((module) => ({
    default: memo(module.default),
  })),
);
const VehiclesPage = lazy(
  () => import('../../../disponiblidad/equipos/equipos'),
);
const Contactos = lazy(
  () => import('../../../inventarioti/celulares/celulares'),
);

const permission = 200;
const EDITION_PERMISSION = 208;

const AvailabilityRoutes = () => {
  return (
    <Route
      path="/disponibilidad"
      element={
        <ProtectedRoute
          element={<AvailabilityLayout />}
          requiredPermissionId={permission}
        />
      }
    >
      <Route index element={<Navigate to="contactos" replace />} />
      <Route
        path="unidades"
        element={
          <ProtectedRoute
            element={
              <Suspense fallback={<LoadingPage />}>
                <VehicleAvailabilityPage />
              </Suspense>
            }
            requiredPermissionId={EDITION_PERMISSION}
          />
        }
      ></Route>
      <Route
        path="operadores"
        element={
          <ProtectedRoute
            element={
              <Suspense fallback={<LoadingPage />}>
                <DriverAvailabilityPage />
              </Suspense>
            }
            requiredPermissionId={EDITION_PERMISSION}
          />
        }
      ></Route>
      <Route
        path="resumen-unidades"
        element={
          <ProtectedRoute
            element={
              <Suspense fallback={<LoadingPage />}>
                <SummaryPage />
              </Suspense>
            }
            requiredPermissionId={EDITION_PERMISSION}
          />
        }
      />
      <Route
        path="resumen-operadores"
        element={
          <ProtectedRoute
            element={
              <Suspense fallback={<LoadingPage />}>
                <DriverSummaryPage />
              </Suspense>
            }
            requiredPermissionId={EDITION_PERMISSION}
          />
        }
      />
      <Route
        path="sin-asignar"
        element={
          <ProtectedRoute
            element={
              <Suspense fallback={<LoadingPage />}>
                <NotAssignedPage />
              </Suspense>
            }
            requiredPermissionId={EDITION_PERMISSION}
          />
        }
      />
      <Route
        path="vehiculos"
        element={
          <Suspense fallback={<LoadingPage />}>
            <VehiclesPage />
          </Suspense>
        }
      />
      <Route
        path="contactos"
        element={
          <Suspense fallback={<LoadingPage />}>
            <Contactos />
          </Suspense>
        }
      />
    </Route>
  );
};

export default AvailabilityRoutes;

