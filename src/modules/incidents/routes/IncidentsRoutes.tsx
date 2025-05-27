import { Suspense, lazy } from 'react';

import { LoadingPage } from '@/pages/LoadingPage';
import { Route } from 'react-router-dom';
import IncidentsLayout from '../components/layouts/IncidentsLayout';

const IncidentsPage = lazy(() => import('../pages/IncidentsPage'));

const IncidentsRoutes = () => (
  <Route path="/incidencias" element={<IncidentsLayout />}>
    <Route
      path=""
      element={
        <Suspense fallback={<LoadingPage />}>
          <IncidentsPage />
        </Suspense>
      }
    ></Route>
  </Route>
);

export default IncidentsRoutes;

