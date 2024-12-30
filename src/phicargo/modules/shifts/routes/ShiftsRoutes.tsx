import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';
import ShiftsLayout from '../layouts/ShiftsLayout';

const ShiftsPage = lazy(() => import('../pages/ShiftsPage'));
const ShiftDetail = lazy(() => import('../outlets/ShiftDetail'));
const CreateShift = lazy(() => import('../outlets/CreateShift'));
const ShiftQueues = lazy(() => import('../outlets/ShiftQueues'));
const CreateIncidence = lazy(() => import('../outlets/CreateIncidence'));
const IncidencesList = lazy(() => import('../outlets/IncidencesList'));

const ShiftsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ShiftsLayout />}>
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
          <Route
            path="cola"
            element={
              <Suspense fallback={null}>
                <ShiftQueues />
              </Suspense>
            }
          />
          <Route
            path="incidencias"
            element={
              <Suspense fallback={null}>
                <IncidencesList />
              </Suspense>
            }
          />
          <Route
            path="incidencias/crear/:id"
            element={
              <Suspense fallback={null}>
                <CreateIncidence />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default ShiftsRoutes;

