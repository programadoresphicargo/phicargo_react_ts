import { Chip } from '@nextui-org/react';

interface Props {
  fleetType: string;
}

const getJobColor = (fleetType: string) => {
  switch (fleetType) {
    case 'local':
      return 'secondary';
    case 'carretera':
      return 'primary';
    default:
      return 'default';
  }
};

const VehicleTypeChip = ({ fleetType }: Props) => {
  return (
    <Chip 
      color={getJobColor(fleetType)} 
      size="sm"
      className='uppercase'
    >
      {fleetType}
    </Chip>
  );
};

export default VehicleTypeChip;

