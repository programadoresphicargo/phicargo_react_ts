import { CellInfoPopover } from '@/modules/drivers-and-vehicles/components/ui/CellInfoPopover';
import type { DriverPosturaSimple } from '@/modules/drivers/models';
import { memo } from 'react';

interface Props {
  driverPostura?: DriverPosturaSimple | null;
}

export const DriverPosturaCell = memo(({ driverPostura }: Props) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <span className="font-bold uppercase text-blue-600">
        {driverPostura?.name}
      </span>
      <CellInfoPopover
        info={
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-400">Iniciao:</span>
              <span className="text-white">
                {driverPostura?.startDate.format('DD/MM/YYYY') || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-400">Fin:</span>
              <span className="text-white">
                {driverPostura?.endDate.format('DD/MM/YYYY') || 'N/A'}
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
});

