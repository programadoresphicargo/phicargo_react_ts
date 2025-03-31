import BaseLayout from '@/layouts/BaseLayout';
import { DateRangeProvider } from '../context/DateRangeContext';
import { Header } from '../components/Header';
import { MenuItemType } from '@/types';
import { ReactNode } from 'react';

const pages: MenuItemType[] = [
  { name: 'Viajes', path: '/dashboards/operaciones', requiredPermissions: [] },
  { name: 'Unidades', path: '/dashboards/unidades', requiredPermissions: [] },
  {
    name: 'Operadores',
    path: '/dashboards/operadores',
    requiredPermissions: [],
  },
  {
    name: 'Llegadas Tarde',
    path: '/dashboards/llegadas-tarde',
    requiredPermissions: [],
  },
  { name: 'Finanzas', path: '/dashboards/finanzas', requiredPermissions: [] },
];

interface Props {
  children?: ReactNode;
}

export const DashboardsLayout = ({ children }: Props) => {
  return (
    <DateRangeProvider>
      <BaseLayout pages={pages}>
        <Header />
        {children}
      </BaseLayout>
    </DateRangeProvider>
  );
};

