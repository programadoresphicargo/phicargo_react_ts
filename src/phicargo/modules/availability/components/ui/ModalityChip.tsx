import { Chip } from '@nextui-org/react';
import { Modality } from '../../models/driver-model';

interface Props {
  modality: Modality;
}

const getModalityColor = (modality: Modality) => {
  switch (modality) {
    case 'full':
      return 'primary';
    case 'sencillo':
      return 'secondary';
    case 'SIN ASIGNAR':
      return 'warning';
    default:
      return 'default';
  }
};

const ModalityChip = ({ modality }: Props) => {
  return (
    <Chip 
      color={getModalityColor(modality)} 
      size="sm"
      className='uppercase'
    >
      {modality}
    </Chip>
  );
};

export default ModalityChip;
