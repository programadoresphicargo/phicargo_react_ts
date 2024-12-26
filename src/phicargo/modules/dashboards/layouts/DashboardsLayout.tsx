import BaseLayout from '../../core/layouts/BaseLayout';
import { MenuItemType } from '../../core/types/global-types';
import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';

const pages: MenuItemType[] = [
  { name: 'Operaciones', path: '/dashboards/operaciones' },
];

interface Props {
  children?: ReactNode;
}

export const DashboardsLayout = ({ children }: Props) => {
  return (
    <BaseLayout pages={pages}>
      {children}
      <Outlet />
    </BaseLayout>
  );
};

