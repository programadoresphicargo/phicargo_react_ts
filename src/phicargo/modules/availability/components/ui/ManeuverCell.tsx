import { CellInfoPopover } from './CellInfoPopover';
import type { ManeuverSimple } from '../../../core/models';
import { memo } from 'react';

const maneuverStatusColor = {
  activa: 'text-green-500',
  cancelada: 'text-red-500',
  borrador: 'text-orange-500',
  finalizada: 'ttext-green-500',
  '': 'text-gray-400',
};

interface Props {
  maneuver?: ManeuverSimple | null;
}

export const ManeuverCell = memo(({ maneuver }: Props) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <span className="font-bold uppercase text-blue-600">
        {maneuver?.type}
      </span>
      <CellInfoPopover
        info={
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-400">ID:</span>
              <span className="text-white">{maneuver?.id || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-400">Status:</span>
              <span
                className={`text-sm ${
                  maneuverStatusColor[maneuver?.status || '']
                }`}
              >
                {maneuver?.status || 'N/A'}
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
});
