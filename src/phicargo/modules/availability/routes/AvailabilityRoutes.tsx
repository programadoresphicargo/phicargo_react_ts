import { Navigate, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';

const VehicleAvailabilityPage = lazy(
  () => import('../pages/VehicleAvailabilityPage'),
);
const VehicleInfo = lazy(() => import('../outlets/VehicleInfo'));
const DriverAvailabilityPage = lazy(
  () => import('../pages/DriverAvailabilityPage'),
);
const DriverInfo = lazy(() => import('../outlets/DriverInfo'));
const NotAssignedPage = lazy(() => import('../pages/NotAssignedPage'));
const SummaryPage = lazy(() => import('../pages/SummaryPage'));
const DriverSummaryPage = lazy(() => import('../pages/DriverSummaryPage'));

const AvailabilityRoutes = () => {
  return (
    <>
      <Route
        index
        element={<Navigate to="/disponibilidad/unidades" replace />}
      />
      <Route
        path="unidades"
        element={
          <Suspense fallback={<LoadingPage />}>
            <VehicleAvailabilityPage />
          </Suspense>
        }
      >
        <Route
          path="detalles/:id"
          element={
            <Suspense fallback={<LoadingPage />}>
              <VehicleInfo />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="operadores"
        element={
          <Suspense fallback={<LoadingPage />}>
            <DriverAvailabilityPage />
          </Suspense>
        }
      >
        <Route
          path="detalles/:id"
          element={
            <Suspense fallback={<LoadingPage />}>
              <DriverInfo />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="resumen-unidades"
        element={
          <Suspense fallback={<LoadingPage />}>
            <SummaryPage />
          </Suspense>
        }
      />
      <Route
        path="resumen-operadores"
        element={
          <Suspense fallback={<LoadingPage />}>
            <DriverSummaryPage />
          </Suspense>
        }
      />
      <Route
        path="sin-asignar"
        element={
          <Suspense fallback={<LoadingPage />}>
            <NotAssignedPage />
          </Suspense>
        }
      />
    </>
  );
};

export default AvailabilityRoutes;

