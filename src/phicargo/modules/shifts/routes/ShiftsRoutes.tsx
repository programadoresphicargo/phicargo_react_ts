import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';

const ShiftsPage = lazy(() => import('../pages/ShiftsPage'));
const ShiftDetail = lazy(() => import('../outlets/ShiftDetail'));
const CreateShift = lazy(() => import('../outlets/CreateShift'));

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
      >
        <Route
          path="detalles/:id"
          element={
            <Suspense fallback={null}>
              <ShiftDetail />
            </Suspense>
          }
        />
        <Route
          path="crear"
          element={
            <Suspense fallback={null}>
              <CreateShift />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default ShiftsRoutes;
