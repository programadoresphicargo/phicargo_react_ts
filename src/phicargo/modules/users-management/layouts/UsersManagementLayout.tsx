import BaseLayout from '@/layouts/BaseLayout';
import { MenuItemType } from '@/types';
import { ReactNode } from 'react';

const pages: MenuItemType[] = [
  {
    name: 'Usuarios',
    path: '/control-usuarios',
    exact: true,
  },
  {
    name: 'Cuentas Operadores',
    path: '/control-usuarios/cuentas-operadores',
  },
];

interface Props {
  children?: ReactNode;
}

const UsersManagementLayout = ({ children }: Props) => {
  return <BaseLayout pages={pages}>{children}</BaseLayout>;
};

export default UsersManagementLayout;
