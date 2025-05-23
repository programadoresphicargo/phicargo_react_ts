import { Suspense, lazy } from 'react';

import ComplaintsLayout from '../layout/ComplaintsLayout';
import { LoadingPage } from '@/pages/LoadingPage';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/router/ProtectedRoute';

const COMPLAINTS_PERMISSION_ID = 213;

const ComplaintsPage = lazy(() => import('../pages/ComplaintsPage'));

const ComplaintsRoutes = () => (
  <Route
    path="quejas"
    element={
      <ProtectedRoute
        element={<ComplaintsLayout />}
        requiredPermissionId={COMPLAINTS_PERMISSION_ID}
      />
    }
  >
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

