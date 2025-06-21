import { Chip } from '@heroui/react';
import type { Modality } from '../../models';

interface Props {
  modality: Modality;
}

const getModalityColor = (modality: Modality) => {
  switch (modality) {
    case 'full':
      return 'primary';
    case 'sencillo':
      return 'secondary';
    case 'single':
      return 'secondary';
    default:
      return 'warning';
  }
};

export const ModalityChip = ({ modality }: Props) => {
  return (
    <Chip
      color={getModalityColor(modality)}
      size="sm"
      className="uppercase text-xs"
    >
      {modality ?? 'SIN ASIGNAR'}
    </Chip>
  );
};
