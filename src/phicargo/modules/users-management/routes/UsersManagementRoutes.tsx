import { Suspense, lazy } from 'react';

import { LoadingPage } from '@/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';
import { Route } from 'react-router-dom';
import UsersManagementLayout from '../layouts/UsersManagementLayout';

const UsersManagementPage = lazy(() => import('../pages/UsersManagementPage'));
const UserInfo = lazy(() => import('../outlets/UserInfo'));

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
    >
      <Route
        path="detalles/:id"
        element={
          <Suspense fallback={null}>
            <UserInfo />
          </Suspense>
        }
      />
    </Route>
    <Route
      path="cuentas-operadores"
      element={
        <Suspense fallback={<LoadingPage />}>
          <DriversAccountsPage />
        </Suspense>
      }
    ></Route>
  </Route>
);

export default UsersManagementRoutes;

