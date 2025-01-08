import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';
import { Route } from 'react-router-dom';
import ShiftsLayout from '../layouts/ShiftsLayout';

const ShiftsPage = lazy(() => import('../pages/ShiftsPage'));
const ShiftDetail = lazy(() => import('../outlets/ShiftDetail'));
const CreateShift = lazy(() => import('../outlets/CreateShift'));
const ShiftQueues = lazy(() => import('../outlets/ShiftQueues'));
const CreateIncidence = lazy(() => import('../outlets/CreateIncidence'));
const IncidencesList = lazy(() => import('../outlets/IncidencesList'));
const TravelsNearToBranch = lazy(
  () => import('../outlets/TravelsNearToBranch'),
);

const ShiftsRoutes = () => (
  <Route path="/turnos" element={<ShiftsLayout />}>
    <Route
      path=""
      element={
        <Suspense fallback={<LoadingPage />}>
          <ShiftsPage />
        </Suspense>
      }
    >
      <Route
        path="detalles/:id"
        element={
          <Suspense fallback={<LoadingPage />}>
            <ShiftDetail />
          </Suspense>
        }
      />
      <Route
        path="crear"
        element={
          <Suspense fallback={<LoadingPage />}>
            <CreateShift />
          </Suspense>
        }
      />
      <Route
        path="cola"
        element={
          <Suspense fallback={<LoadingPage />}>
            <ShiftQueues />
          </Suspense>
        }
      />
      <Route
        path="incidencias"
        element={
          <Suspense fallback={<LoadingPage />}>
            <IncidencesList />
          </Suspense>
        }
      />
      <Route
        path="incidencias/crear/:id"
        element={
          <Suspense fallback={<LoadingPage />}>
            <CreateIncidence />
          </Suspense>
        }
      />
      <Route
        path="unidades-bajando"
        element={
          <Suspense fallback={<LoadingPage />}>
            <TravelsNearToBranch />
          </Suspense>
        }
      />
      <Route
        path="unidades-descargando"
        element={
          <Suspense fallback={<LoadingPage />}>
            <TravelsNearToBranch />
          </Suspense>
        }
      />
      <Route
        path="unidades-planta"
        element={
          <Suspense fallback={<LoadingPage />}>
            <TravelsNearToBranch />
          </Suspense>
        }
      />
    </Route>
  </Route>
);

export default ShiftsRoutes;

