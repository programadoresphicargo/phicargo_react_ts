import { BsBusFrontFill } from 'react-icons/bs';
import { FaRegUserCircle } from 'react-icons/fa';
import { FaWarehouse } from 'react-icons/fa';
import type { MaintenanceRecord } from '../models';
import { MdOutlineSmsFailed } from 'react-icons/md';

interface Props {
  record: MaintenanceRecord;
}

export const RecordInfo = ({ record }: Props) => {
  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex items-center text-medium">
        <BsBusFrontFill className="text-blue-500 mr-2" />
        <span className="font-semibold text-gray-800">Unidad:</span>
        <span className="ml-1 text-gray-700">{record?.vehicle.name}</span>
      </div>
      <div className="flex items-center text-medium">
        <FaWarehouse className="text-green-500 mr-2" />
        <span className="text-gray-800">Taller:</span>
        <span className="ml-1 text-gray-700">
          {record?.workshop.name || 'Sin estado'}
        </span>
      </div>
      <div className="flex items-center text-medium">
        <MdOutlineSmsFailed className="text-yellow-400 mr-2" />
        <span className="text-gray-800">Tipo de reporte:</span>
        <span className="ml-1 text-gray-700">
          {record?.failType || 'Sin estado'}
        </span>
      </div>
      <div className="flex items-center text-medium">
        <FaRegUserCircle className="text-blue-950 mr-2" />
        <span className="text-gray-800">Supervisor:</span>
        <span className="ml-1 text-gray-700">
          {record?.supervisor || 'Sin estado'}
        </span>
      </div>
    </div>
  );
};

