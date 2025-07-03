import { Navigate } from 'react-router-dom';
import { incidentsPages } from '../constants/incidentsPages';

export const RedirectToFirstIncidentsPage = ({ permissions }: { permissions: number[] }) => {
    const firstAllowed = incidentsPages.find((page) =>
        page.requiredPermissions.some((p) => permissions.includes(p))
    );

    if (firstAllowed) {
        return <Navigate to={firstAllowed.path} replace />;
    }

    return <Navigate to="/sin-permiso" replace />;
};