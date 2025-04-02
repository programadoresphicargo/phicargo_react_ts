import { Chip, Tooltip } from '@heroui/react';

import { VehicleStatusChangeHistory } from '../VehicleStatusChangeHistory';
import { useState } from 'react';

interface Props {
  vehicleName: string;
  vehicleId: number;
  chip?: boolean;
  chipColor?:
    | 'primary'
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
}

export const VehicleNameCell = ({
  vehicleName,
  vehicleId,
  chip,
  chipColor,
}: Props) => {
  const [openStatus, setOpenStatus] = useState(false);

  return (
    <>
      <Tooltip 
        content="Ver Cambios de Estado"
        showArrow
      >
        {chip ? (
          <Chip
            onClick={() => setOpenStatus(true)}
            className="cursor-pointer"
            size="sm"
            color={chipColor ?? 'primary'}
          >
            {vehicleName}
          </Chip>
        ) : (
          <span
            className="font-bold uppercase cursor-pointer hover:text-primary-600 transition-colors"
            onClick={() => setOpenStatus(true)}
          >
            {vehicleName}
          </span>
        )}
      </Tooltip>
      <VehicleStatusChangeHistory
        open={openStatus}
        onClose={() => setOpenStatus(false)}
        vehicleId={vehicleId}
      />
    </>
  );
};

