import { ReactNode } from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import { IncidentsProvider } from '../../context/IncidentsContext';
import { incidentsPages } from '../../constants/incidentsPages';

interface Props {
  children?: ReactNode;
}

const IncidentsLayout = ({ children }: Props) => {
  return (
    <IncidentsProvider>
      <BaseLayout pages={incidentsPages}>{children}</BaseLayout>
    </IncidentsProvider>
  );
};

export default IncidentsLayout;
