import { Navigate, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { DashboardsLayout } from '../layouts/DashboardsLayout';
import { LoadingPage } from '../../core/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';

const TravelsDashboardPage = lazy(
  () => import('../pages/TravelsDashboardPage'),
);
const VehiclesDashboard = lazy(() => import('../pages/VehiclesDashboard'));
const DriverDashboardPage = lazy(() => import('../pages/DriverDashboardPage'));
const DepartureAndArrivalDashboardPage = lazy(
  () => import('../pages/DepartureAndArrivalDashboardPage'),
);
const FinanceDashbordPage = lazy(() => import('../pages/FinanceDashbordPage'));

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
          <TravelsDashboardPage />
        </Suspense>
      }
    />
    <Route
      path="unidades"
      element={
        <Suspense fallback={<LoadingPage />}>
          <VehiclesDashboard />
        </Suspense>
      }
    />
    <Route
      path="operadores"
      element={
        <Suspense fallback={<LoadingPage />}>
          <DriverDashboardPage />
        </Suspense>
      }
    />
    <Route
      path="llegadas-tarde"
      element={
        <Suspense fallback={<LoadingPage />}>
          <DepartureAndArrivalDashboardPage />
        </Suspense>
      }
    />
    <Route
      path="finanzas"
      element={
        <Suspense fallback={<LoadingPage />}>
          <FinanceDashbordPage />
        </Suspense>
      }
    />
  </Route>
);

export default DashboardsRoutes;

