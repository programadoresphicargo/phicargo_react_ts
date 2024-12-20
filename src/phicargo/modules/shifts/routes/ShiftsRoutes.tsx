import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';

const ShiftsPage = lazy(() => import('../pages/ShiftsPage'));

const ShiftsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingPage />}>
            <ShiftsPage />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default ShiftsRoutes;
