import BaseLayout from '@/layouts/BaseLayout';
import type { MenuItemType } from '@/types';
import { ReactNode } from 'react';

const EDITION_PERMISSION = 208;

const pages: MenuItemType[] = [
  {
    name: 'Unidades',
    path: '/disponibilidad/unidades',
    requiredPermissions: [EDITION_PERMISSION],
  },
  {
    name: 'Operadores',
    path: '/disponibilidad/operadores',
    requiredPermissions: [EDITION_PERMISSION],
  },
  {
    name: 'Contactos',
    path: '/disponibilidad/contactos',
    requiredPermissions: [],
  },
  {
    name: 'Resumen Unidades',
    path: '/disponibilidad/resumen-unidades',
    requiredPermissions: [EDITION_PERMISSION],
  },
  {
    name: 'Resumen Operadores',
    path: '/disponibilidad/resumen-operadores',
    requiredPermissions: [EDITION_PERMISSION],
  },
  {
    name: 'Sin asignar',
    path: '/disponibilidad/sin-asignar',
    requiredPermissions: [EDITION_PERMISSION],
  },
  { name: 'Todos', path: '/disponibilidad/vehiculos', requiredPermissions: [] },
];

interface Props {
  children?: ReactNode;
}

const AvailabilityLayout = ({ children }: Props) => {
  return <BaseLayout pages={pages}>{children}</BaseLayout>;
};

export default AvailabilityLayout;

