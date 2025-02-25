import { Navigate, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';
import ServiceRequestsLayout from '../layout/ServiceRequestsLayout';

const ServiceRequestPage = lazy(() => import('../pages/ServiceRequestPage'));

export const ServiceRequestsRoutes = () => {
  return (
    <Route path="/solicitudes-servicio" element={<ServiceRequestsLayout />}>
      <Route index element={<Navigate to="solicitudes" />} />
      <Route
        path="solicitudes"
        element={
          <Suspense fallback={<LoadingPage />}>
            <h1>Solicitudes</h1>
          </Suspense>
        }
      />
      <Route
        path="nueva-solicitud"
        element={
          <Suspense fallback={<LoadingPage />}>
            <ServiceRequestPage />
          </Suspense>
        }
      />
    </Route>
  );
};

