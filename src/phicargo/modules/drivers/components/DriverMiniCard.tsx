import { BsBusFrontFill } from 'react-icons/bs';
import type { Driver } from '../models';
import { FaRegUser } from 'react-icons/fa';
import { FaTruckLoading } from 'react-icons/fa';
import { GrLicense } from 'react-icons/gr';
import { MdOutlineWork } from 'react-icons/md';

interface Props {
  driver: Driver;
}

const DriverMiniCard = ({ driver }: Props) => {
  return (
    <div className="p-2 border rounded-lg bg-gray-100 flex flex-col space-y-1 shadow-md">
      <div className="flex items-center text-sm">
        <FaRegUser className="text-blue-500 mr-2" />
        <span className="font-semibold text-gray-800">Operador:</span>
        <span className="ml-1 text-gray-700">{driver.name}</span>
      </div>
      <div className="flex items-center text-sm">
        <GrLicense className="text-gray-500 mr-2" />
        <span className="text-gray-600">Licencia:</span>
        <span className="ml-1 text-gray-700">{driver.licenseId}</span>
      </div>
      <div className="flex items-center text-sm">
        <FaTruckLoading className="text-green-500 mr-2" />
        <span className="text-gray-600">Modalidad:</span>
        <span className="ml-1 text-gray-700">{driver.modality}</span>
      </div>
      <div className="flex items-center text-sm">
        <MdOutlineWork className="text-yellow-500 mr-2" />
        <span className="text-gray-600">Puesto:</span>
        <span className="ml-1 text-gray-700">
          {driver.job?.name || 'Sin asignar'}
        </span>
      </div>
      <div className="flex items-center text-sm">
        <BsBusFrontFill className="text-purple-500 mr-2" />
        <span className="text-gray-600">Unidad:</span>
        <span className="ml-1 text-gray-700">
          {driver.vehicle?.name || 'Sin asignar'}
        </span>
      </div>
    </div>
  );
};

export default DriverMiniCard;

