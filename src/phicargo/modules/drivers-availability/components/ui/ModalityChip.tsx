import Chip from '@mui/material/Chip';
import { Modality } from '../../models/driver-model';

interface Props {
  modality: Modality;
}

const getModalityColor = (modality: Modality) => {
  switch (modality) {
    case 'full':
      return 'primary';
    case 'single':
      return 'secondary';
    case 'SIN ASIGNAR':
      return 'warning';
    default:
      return 'default';
  }
};

const ModalityChip = ({ modality }: Props) => {
  return <Chip label={modality} color={getModalityColor(modality)} size='small' />;
};

export default ModalityChip;
