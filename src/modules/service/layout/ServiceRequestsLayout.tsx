import BaseLayout from '@/layouts/BaseLayout';
import type { MenuItemType } from '@/types';
import { ReactNode } from 'react';

const pages: MenuItemType[] = [
  {
    name: 'Servicios',
    path: '/servicios',
    requiredPermissions: [],
  },
  {
    name: 'Solicitudes',
    path: '/servicios/solicitudes',
    requiredPermissions: [],
  },
  {
    name: 'Nueva Solicitud',
    path: '/servicios/nueva-solicitud',
    requiredPermissions: [],
  },
];

interface Props {
  children?: ReactNode;
}

const ServiceRequestsLayout = ({ children }: Props) => {
  return <BaseLayout pages={pages}>{children}</BaseLayout>;
};

export default ServiceRequestsLayout;

