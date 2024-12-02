import { Route, Routes } from 'react-router-dom';

import LoginPage from '../phicargo/modules/auth/pages/LoginPage';

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/*" element={<LoginPage />} />
      <Route path="/*" element={<LoginPage />} />
    </Routes>
  );
};
