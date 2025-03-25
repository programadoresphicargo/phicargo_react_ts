import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import { useAuthContext } from '../phicargo/modules/auth/hooks';

interface Props {
  element: ReactNode;
  requiredPermissionId?: number;
}

const ProtectedRoute = ({ element, requiredPermissionId }: Props) => {
  const { session } = useAuthContext();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (
    requiredPermissionId &&
    !session.user.permissions.includes(requiredPermissionId)
  ) {
    return <UnauthorizedPage />;
  }

  return element;
};

export default ProtectedRoute;

