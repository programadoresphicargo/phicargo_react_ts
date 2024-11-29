import BaseLayout from '../../core/layouts/BaseLayout';
import { MenuItemType } from '../../core/types/global-types';
import { ReactNode } from 'react';

const pages: MenuItemType[] = [
  { name: 'Unidades', path: '/disponibilidad/unidades' },
  { name: 'Operadores', path: '/disponibilidad/operadores' },
  { name: 'Resumen', path: '/disponibilidad/resumen' },
  { name: 'Sin asignar', path: '/disponibilidad/sin-asignar' }
];

interface Props {
  children: ReactNode;
}

const AvailabilityLayout = ({ children }: Props) => {
  return <BaseLayout pages={pages}>{children}</BaseLayout>;
};

export default AvailabilityLayout;
