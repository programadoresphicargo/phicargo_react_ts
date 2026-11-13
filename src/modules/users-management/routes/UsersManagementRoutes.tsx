import { Suspense, lazy } from 'react';

import { LoadingPage } from '@/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';
import { Route } from 'react-router-dom';
import UsersManagementLayout from '../layouts/UsersManagementLayout';

const UsersManagementPage = lazy(() => import('../pages/UsersManagementPage'));
const UsersControlPage = lazy(() => import('../permissions'));
const DriversAccountsPage = lazy(() => import('../pages/DriversAccountsPage'));

const userManagementPermission = 5;

const UsersManagementRoutes = () => (
  <Route
    path="/control-usuarios"
    element={
      <ProtectedRoute
        element={<UsersManagementLayout />}
        requiredPermissionId={userManagementPermission}
      />
    }
  >
    <Route
      path=""
      element={
        <Suspense fallback={<LoadingPage />}>
          <UsersManagementPage />
        </Suspense>
      }
    ></Route>
    <Route
      path="cuentas-operadores"
      element={
        <Suspense fallback={<LoadingPage />}>
          <DriversAccountsPage />
        </Suspense>
      }
    ></Route>
    <Route
      path="control-permisos"
      element={
        <Suspense fallback={<LoadingPage />}>
          <UsersControlPage></UsersControlPage>
        </Suspense>
      }
    ></Route>
  </Route>
);

export default UsersManagementRoutes;

