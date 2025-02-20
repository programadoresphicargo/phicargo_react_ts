import { Chip } from "@heroui/react";
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
    default:
      return 'default';
  }
};

const StatusChip = ({ status }: Props) => {
  return (
    <Chip className="uppercase" color={getStatusColor(status)} size="sm">
      {status || 'Desconocido'}
    </Chip>
  );
};

export default StatusChip;
