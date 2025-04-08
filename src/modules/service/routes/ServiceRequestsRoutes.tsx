import { Suspense, lazy } from 'react';

import { LoadingPage } from '@/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';
import { Route } from 'react-router-dom';
import ServiceRequestsLayout from '../layout/ServiceRequestsLayout';

const ServicesPage = lazy(() => import('../pages/ServicesPage'));
const ServiceRequestsPage = lazy(() => import('../pages/ServiceRequestsPage'));
const CreteServiceRequestPage = lazy(
  () => import('../pages/CreteServiceRequestPage'),
);

const permission = 204;

export const ServiceRequestsRoutes = () => {
  return (
    <Route
      path="/servicios"
      element={
        <ProtectedRoute
          element={<ServiceRequestsLayout />}
          requiredPermissionId={permission}
        />
      }
    >
      <Route
        path=""
        element={
          <Suspense fallback={<LoadingPage />}>
            <ServicesPage />
          </Suspense>
        }
      />
      <Route
        path="solicitudes"
        element={
          <Suspense fallback={<LoadingPage />}>
            <ServiceRequestsPage />
          </Suspense>
        }
      />
      <Route
        path="nueva-solicitud"
        element={
          <Suspense fallback={<LoadingPage />}>
            <CreteServiceRequestPage />
          </Suspense>
        }
      />
    </Route>
  );
};

