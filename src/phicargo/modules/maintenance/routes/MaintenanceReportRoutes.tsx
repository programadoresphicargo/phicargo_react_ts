import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';

const MaintenanceReportPage = lazy(
  () => import('../pages/MaintenanceReportPage'),
);
const RecordDetails = lazy(() => import('../outlets/RecordDetails'));
const CreateNewRecord = lazy(() => import('../outlets/CreateNewRecord'));

const MaintenanceReportRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingPage />}>
            <MaintenanceReportPage />
          </Suspense>
        }
      >
        <Route
          path="detalles/:id"
          element={
            <Suspense fallback={null}>
              <RecordDetails />
            </Suspense>
          }
        />
        <Route
          path="nuevo"
          element={
            <Suspense fallback={null}>
              <CreateNewRecord />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default MaintenanceReportRoutes;
