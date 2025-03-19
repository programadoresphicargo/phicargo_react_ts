import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import LoginPage from '../phicargo/modules/auth/pages/LoginPage';
import { useAuthContext } from '@/phicargo/modules/auth/hooks';
import PoliticaUso from '@/phicargo/politica/politica';

export const PublicRoutes = () => {
  const location = useLocation();
  const { setRedirectTo } = useAuthContext();

  const publicPaths = ['/auth/login', '/politicas'];

  useEffect(() => {
    if (!publicPaths.includes(location.pathname)) {
      setRedirectTo(location.pathname);
    }
  }, [location, setRedirectTo]);

  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/politicas" element={<PoliticaUso />} />
      <Route path="*" element={<Navigate to={'/auth/login'} />} />
    </Routes>
  );
};
