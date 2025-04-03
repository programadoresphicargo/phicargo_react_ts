import { IoMdInformationCircle } from 'react-icons/io';
import { VehicleStatusChangeHistory } from '../VehicleStatusChangeHistory';
import { useState } from 'react';

interface Props {
  value: string | number;
  vehicleId: number;
}

export const OperationalDaysCell = ({ vehicleId, value }: Props) => {
  const [openStatus, setOpenStatus] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="font-bold uppercase">{value}</span>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setOpenStatus(true)}
        >
          <IoMdInformationCircle className="w-5 h-5" />
        </button>
      </div>
      <VehicleStatusChangeHistory
        open={openStatus}
        onClose={() => setOpenStatus(false)}
        vehicleId={vehicleId}
      />
    </>
  );
};

