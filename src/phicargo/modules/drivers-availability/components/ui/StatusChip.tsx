import Chip from '@mui/material/Chip';
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
      return 'error';
    default:
      return 'default';
  }
};

const StatusChip = ({ status }: Props) => {
  return <Chip label={status} color={getStatusColor(status)} size='small' />;
};

export default StatusChip;
