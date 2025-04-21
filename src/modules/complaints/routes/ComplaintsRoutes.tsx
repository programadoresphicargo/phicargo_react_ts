import { Suspense, lazy } from 'react';

import ComplaintsLayout from '../layout/ComplaintsLayout';
import { LoadingPage } from '@/pages/LoadingPage';
import { Route } from 'react-router-dom';

const ComplaintsPage = lazy(() => import('../pages/ComplaintsPage'));

const ComplaintsRoutes = () => (
  <Route path="quejas" element={<ComplaintsLayout />}>
    <Route
      path=""
      element={
        <Suspense fallback={<LoadingPage />}>
          <ComplaintsPage />
        </Suspense>
      }
    />
  </Route>
);

export default ComplaintsRoutes;

