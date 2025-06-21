import { ReactNode } from 'react';
import type { MenuItemType } from '@/types';
import BaseLayout from '@/layouts/BaseLayout';
import { IncidentsProvider } from '../../context/IncidentsContext';

const INCIDENTS_PERMISSION = 214;
const DIRECTION_INCIDENTS_PERMISSION = 215;
const VEHICLE_INSPECTION_PERMISSION = 216;

const pages: MenuItemType[] = [
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
    name: 'Revisión de Únidades',
    path: '/incidencias/inspeccion-unidades',
    requiredPermissions: [VEHICLE_INSPECTION_PERMISSION],
    exact: true,
  },
  // {
  //   name: 'Capacitación',
  //   path: '/incidencias/capacitacion',
  //   requiredPermissions: [],
  //   exact: true,
  // },
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

