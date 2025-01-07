import BaseLayout from '../../core/layouts/BaseLayout';
import { DateRangeProvider } from '../context/DateRangeContext';
import { MenuItemType } from '../../core/types/global-types';
import { ReactNode } from 'react';

const pages: MenuItemType[] = [
  { name: 'Operaciones', path: '/dashboards/operaciones' },
];

interface Props {
  children?: ReactNode;
}

export const DashboardsLayout = ({ children }: Props) => {
  return (
    <DateRangeProvider>
      <BaseLayout pages={pages}>{children}</BaseLayout>
    </DateRangeProvider>
  );
};

