import { Chip } from '@nextui-org/react';
import { Status } from '../../models/driver-model';

interface Props {
  status: Status;
}

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'disponible':
      return 'primary';
    case 'viaje':
      return 'secondary';
    case 'maniobra':
      return 'warning';
    case 'SIN ASIGNAR':
      return 'danger';
    default:
      return 'default';
  }
};

const StatusChip = ({ status }: Props) => {
  return (
    <Chip className="uppercase" color={getStatusColor(status)} size="sm">
      {status}
    </Chip>
  );
};

export default StatusChip;
