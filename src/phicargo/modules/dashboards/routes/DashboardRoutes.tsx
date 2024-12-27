import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { DashboardsLayout } from '../layouts/DashboardsLayout';
import { LoadingPage } from '../../core/pages/LoadingPage';

const OperationsDashboardPage = lazy(
  () => import('../pages/OperationsDashboardPage'),
);

const DashboardsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardsLayout />}>
        <Route index element={<Navigate to="operaciones" replace />} />
        <Route
          path="operaciones"
          element={
            <Suspense fallback={<LoadingPage />}>
              <OperationsDashboardPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default DashboardsRoutes;

