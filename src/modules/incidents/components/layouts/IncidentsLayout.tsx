import { ReactNode } from 'react';
import type { MenuItemType } from '@/types';
import BaseLayout from '@/layouts/BaseLayout';
import { IncidentsProvider } from '../../context/IncidentsContext';

const INCIDENTS_PERMISSION = 214;
const DIRECTION_INCIDENTS_PERMISSION = 215;
const VEHICLE_INSPECTION_PERMISSION_SECURITY = 216;
const VEHICLE_INSPECTION_PERMISSION_LEGAL = 217;
const DISCOUNTS = 444;

const pages: MenuItemType[] = [
  {
    name: 'Incidencias',
    path: '/incidencias',
    requiredPermissions: [INCIDENTS_PERMISSION],
    exact: true,
  },
  {
    name: 'Descuentos',
    path: '/descuentos',
    requiredPermissions: [DISCOUNTS],
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

interface Props {
  children?: ReactNode;
}

const IncidentsLayout = ({ children }: Props) => {
  return (
    <IncidentsProvider>
      <BaseLayout pages={pages}>{children}</BaseLayout>
    </IncidentsProvider>
  );
};

export default IncidentsLayout;

