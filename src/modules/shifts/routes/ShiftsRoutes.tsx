import { Suspense, lazy } from 'react';

import { LoadingPage } from '@/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';
import { Route } from 'react-router-dom';
import ShiftsLayout from '../layouts/ShiftsLayout';

const ShiftsPage = lazy(() => import('../pages/ShiftsPage'));
const ShiftDetail = lazy(() => import('../outlets/ShiftDetail'));
const CreateShift = lazy(() => import('../outlets/CreateShift'));
const ShiftQueues = lazy(() => import('../outlets/ShiftQueues'));
const TravelsNearToBranch = lazy(
  () => import('../outlets/TravelsNearToBranch'),
);
const TravelsUnloading = lazy(() => import('../outlets/TravelsUnloading'));
const TravelsInPlant = lazy(() => import('../outlets/TravelsInPlant'));
const HistorialAsignado = lazy(() => import('../outlets/HistorialAsignado'));

const permission = 202;

const ShiftsRoutes = () => (
  <Route
    path="/turnos"
    element={
      <ProtectedRoute
        element={<ShiftsLayout />}
        requiredPermissionId={permission}
      />
    }
  >
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
            <TravelsUnloading />
          </Suspense>
        }
      />
      <Route
        path="unidades-planta"
        element={
          <Suspense fallback={<LoadingPage />}>
            <TravelsInPlant />
          </Suspense>
        }
      />
      <Route
        path="historial-asignado"
        element={
          <Suspense fallback={<LoadingPage />}>
            <HistorialAsignado></HistorialAsignado>
          </Suspense>
        }
      />
    </Route>
  </Route>
);

export default ShiftsRoutes;

