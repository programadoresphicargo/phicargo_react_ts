import BaseLayout from '../../core/layouts/BaseLayout';
import { MenuItemType } from '../../core/types/global-types';
import { ReactNode } from 'react';

const pages: MenuItemType[] = [
  {
    name: 'Solicitudes',
    path: '/solicitudes-servicio/solicitudes',
  },
  {
    name: 'Nueva Solicitud',
    path: '/solicitudes-servicio/nueva-solicitud',
  },
];

interface Props {
  children?: ReactNode;
}

const ServiceRequestsLayout = ({ children }: Props) => {
  return <BaseLayout pages={pages}>{children}</BaseLayout>;
};

export default ServiceRequestsLayout;

