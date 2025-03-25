import BaseLayout from '@/layouts/BaseLayout';
import { MenuItemType } from '@/types';
import { ReactNode } from 'react';

const pages: MenuItemType[] = [
  { name: 'Unidades', path: '/disponibilidad/unidades' },
  { name: 'Operadores', path: '/disponibilidad/operadores' },
  { name: 'Contactos', path: '/disponibilidad/contactos' },
  { name: 'Resumen Unidades', path: '/disponibilidad/resumen-unidades' },
  { name: 'Resumen Operadores', path: '/disponibilidad/resumen-operadores' },
  { name: 'Sin asignar', path: '/disponibilidad/sin-asignar' },
  { name: 'Todos', path: '/disponibilidad/vehiculos' },
];

interface Props {
  children?: ReactNode;
}

const AvailabilityLayout = ({ children }: Props) => {
  return <BaseLayout pages={pages}>{children}</BaseLayout>;
};

export default AvailabilityLayout;
