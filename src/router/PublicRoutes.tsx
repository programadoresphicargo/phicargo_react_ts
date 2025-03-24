import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';

import { LoadingPage } from '@/pages/LoadingPage';
import LoginPage from '../phicargo/modules/auth/pages/LoginPage';
import { useAuthContext } from '@/phicargo/modules/auth/hooks';

const UsagePoliciesPage = lazy(() => import('@/pages/UsagePoliciesPage'));

const publicPaths = ['/auth/login', '/politicas'];

export const PublicRoutes = () => {
  const location = useLocation();
  const { setRedirectTo } = useAuthContext();

  useEffect(() => {
    if (!publicPaths.includes(location.pathname)) {
      setRedirectTo(location.pathname);
    }
  }, [location, setRedirectTo]);

  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route
        path="/politicas"
        element={
          <Suspense fallback={<LoadingPage />}>
            <UsagePoliciesPage />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to={'/auth/login'} />} />
    </Routes>
  );
};

