import BaseLayout from '../../core/layouts/BaseLayout';
import { MenuItemType } from '../../core/types/global-types';
import { ReactNode } from 'react';

const pages: MenuItemType[] = [
  { name: 'Turnos', path: '/turnos' },
];

interface Props {
  children: ReactNode;
}

const ShiftsLayout = ({ children }: Props) => {
  return <BaseLayout pages={pages}>{children}</BaseLayout>;
};

export default ShiftsLayout;
