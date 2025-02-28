import { Navigate, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';
import ServiceRequestsLayout from '../layout/ServiceRequestsLayout';

const ServiceRequestsPage = lazy(() => import('../pages/ServiceRequestsPage'));
const CreteServiceRequestPage = lazy(
  () => import('../pages/CreteServiceRequestPage'),
);

export const ServiceRequestsRoutes = () => {
  return (
    <Route path="/solicitudes-servicio" element={<ServiceRequestsLayout />}>
      <Route index element={<Navigate to="solicitudes" />} />
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

