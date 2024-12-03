import { Navigate, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';

const ShiftsPage = lazy(() => import('../pages/ShiftsPage'));

const ShiftsRoutes = () => {
  return (
    <>
      <Route
        index
        element={<Navigate to="/turnos/lista" replace />}
      />
      <Route
        path="lista"
        element={
          <Suspense fallback={<LoadingPage />}>
            <ShiftsPage />
          </Suspense>
        }
      />
    </>
  );
};

export default ShiftsRoutes;
