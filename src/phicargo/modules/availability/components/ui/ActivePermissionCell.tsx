import { CellInfoPopover } from './CellInfoPopover';
import { Driver } from '../../models/driver-model';
import { getValidPermission } from '../../utilities';
import { memo } from 'react';

interface Props {
  driver: Driver;
}

export const ActivePermissionCell = memo(({ driver }: Props) => {
  const validPermission = getValidPermission(driver);
  return !validPermission ? (
    <span className="text-gray-400 text-sm">{'N/A'}</span>
  ) : (
    <div className="flex flex-row gap-2 items-center">
      <span className="font-bold uppercase text-yellow-600">
        {validPermission.reasonType}
      </span>
      <CellInfoPopover
        info={
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-400">DE:</span>
              <span className="text-white">{validPermission?.startDate?.format('DD/MM/YYYY') || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-400">A:</span>
              <span className="text-white">{validPermission?.endDate?.format('DD/MM/YYYY') || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm`}
              >
                {validPermission?.description || 'N/A'}
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
});

