import { Chip } from '@heroui/react';
import type { DriverStatus } from '../../models';

interface Props {
  status: DriverStatus;
}

const getStatusColor = (status: DriverStatus) => {
  switch (status) {
    case 'disponible':
      return 'primary';
    case 'viaje':
      return 'secondary';
    case 'maniobra':
      return 'warning';
    default:
      return 'default';
  }
};

export const DriverStatusChip = ({ status }: Props) => {
  return (
    <Chip className="uppercase" color={getStatusColor(status)} size="sm">
      {status || 'Desconocido'}
    </Chip>
  );
};
