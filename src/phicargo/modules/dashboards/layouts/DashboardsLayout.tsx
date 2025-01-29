import BaseLayout from '../../core/layouts/BaseLayout';
import { DateRangeProvider } from '../context/DateRangeContext';
import { Header } from '../components/Header';
import { MenuItemType } from '../../core/types/global-types';
import { ReactNode } from 'react';

const pages: MenuItemType[] = [
  { name: 'Viajes', path: '/dashboards/operaciones' },
  { name: 'Unidades', path: '/dashboards/unidades' },
  { name: 'Operadores', path: '/dashboards/operadores' },
  { name: 'Llegadas Tarde', path: '/dashboards/llegadas-tarde' },
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

