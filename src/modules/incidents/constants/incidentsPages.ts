import type { MenuItemType } from '@/types';

export const INCIDENTS_PERMISSION = 214;
export const DIRECTION_INCIDENTS_PERMISSION = 215;
export const VEHICLE_INSPECTION_PERMISSION_SECURITY = 216;
export const VEHICLE_INSPECTION_PERMISSION_LEGAL = 217;

export const incidentsPages: MenuItemType[] = [
    {
        name: 'Incidencias',
        path: '/incidencias',
        requiredPermissions: [INCIDENTS_PERMISSION],
        exact: true,
    },
    {
        name: 'Incidencias Dirección',
        path: '/incidencias/direccion',
        requiredPermissions: [DIRECTION_INCIDENTS_PERMISSION],
        exact: true,
    },
    {
        name: 'Revisión de Únidades (Vigilancia)',
        path: '/incidencias/inspeccion-unidades',
        requiredPermissions: [VEHICLE_INSPECTION_PERMISSION_SECURITY],
        exact: true,
    },
    {
        name: 'Revisión de Únidades (Legal)',
        path: '/incidencias/inspeccion-unidades-legal',
        requiredPermissions: [VEHICLE_INSPECTION_PERMISSION_LEGAL],
        exact: true,
    },
];
