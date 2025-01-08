import { LoadingPage } from '../phicargo/modules/core/pages/LoadingPage';
import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';
import { useAuthContext } from '../phicargo/modules/auth/hooks';

/**
 * AppRouter de la aplicación
 * @returns Componente con las rutas de la aplicación
 */
export const AppRouter = () => {
  const { authStatus } = useAuthContext();

  if (authStatus === 'loading') {
    return <LoadingPage />;
  }

  return (
    <>
      {authStatus === 'authenticated' ? <PrivateRoutes /> : <PublicRoutes />}
    </>
  );
};

