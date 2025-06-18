import { ReactNode } from 'react';
import type { MenuItemType } from '@/types';
import BaseLayout from '@/layouts/BaseLayout';
import { IncidentsProvider } from '../../context/IncidentsContext';

const pages: MenuItemType[] = [
  {
    name: 'Incidencias',
    path: '/incidencias',
    requiredPermissions: [],
    exact: true,
  },
  {
    name: 'Incidencias Dirección',
    path: '/incidencias/direccion',
    requiredPermissions: [],
    exact: true,
  },
  {
    name: 'Revisión de Únidades',
    path: '/incidencias/inspeccion-unidades',
    requiredPermissions: [],
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

