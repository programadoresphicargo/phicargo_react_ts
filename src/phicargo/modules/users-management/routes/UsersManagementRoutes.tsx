import { Navigate, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { LoadingPage } from '../../core/pages/LoadingPage';

const UsersManagementPage = lazy(() => import('../pages/UsersManagementPage'));
const UserInfo = lazy(() => import('../outlets/UserInfo'));

const UsersManagementRoutes = () => {
  return (
    <>
      <Route
        index
        element={<Navigate to="/control-usuarios/usuarios" replace />}
      />
      <Route
        path="usuarios"
        element={
          <Suspense fallback={<LoadingPage />}>
            <UsersManagementPage />
          </Suspense>
        }
      >
        <Route
          path='detalles/:id' 
          element={
            <Suspense fallback={null}>
              <UserInfo />
            </Suspense>
          } 
        />
      </Route>
    </>
  );
};

export default UsersManagementRoutes;

