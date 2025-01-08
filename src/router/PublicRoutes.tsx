import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import LoginPage from '../phicargo/modules/auth/pages/LoginPage';
import { useAuthContext } from '@/phicargo/modules/auth/hooks';
import { useEffect } from 'react';

export const PublicRoutes = () => {
  const location = useLocation();
  const { setRedirectTo } = useAuthContext();

  useEffect(() => {
    if (location.pathname !== '/auth/login') {
      setRedirectTo(location.pathname);
    }
  }, [location, setRedirectTo]);


  return (
    <Routes>
      <Route path="*" element={<Navigate to={'/auth/login'} />} />
      <Route path="/auth/login" element={<LoginPage />} />
    </Routes>
  );
};
