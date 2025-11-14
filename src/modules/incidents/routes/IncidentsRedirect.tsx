import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/modules/auth/hooks';

const INCIDENTS_SUBROUTES = [
    { path: 'incidencias', permission: 214 },
    { path: 'descuentos', permission: 444 },
    { path: 'direccion', permission: 215 },
    { path: 'inspeccion-unidades', permission: 216 },
    { path: 'inspeccion-unidades-legal', permission: 217 },
];

const IncidentsRedirect = () => {
    const { session } = useAuthContext();

    if (!session) {
        return <div>Cargando sesión...</div>; // o <Navigate to="/" replace /> si prefieres redirigir
    }

    const allowed = INCIDENTS_SUBROUTES.find(route =>
        session.user.permissions.includes(route.permission)
    );

    if (allowed) {
        return <Navigate to={`/incidencias/${allowed.path}`} replace />;
    }

    return <div>No tienes permisos para acceder a esta sección.</div>;
};


export default IncidentsRedirect;
