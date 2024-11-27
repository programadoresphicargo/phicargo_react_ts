import { BsBusFrontFill } from 'react-icons/bs';
import { CiBoxes } from 'react-icons/ci';
import { FaCircle } from 'react-icons/fa6';
import { FaCogs } from 'react-icons/fa';
import { FaRegUser } from 'react-icons/fa';
import type { Vehicle } from '../models/vehicle-model';

interface Props {
  vehicle: Vehicle;
}

const VehicleMiniCard = ({ vehicle }: Props) => {
  return (
    <div className="p-2 border rounded-lg bg-gray-100 flex flex-col space-y-1 shadow-md">
      <div className="flex items-center text-sm">
        <BsBusFrontFill className="text-blue-500 mr-2" />
        <span className="font-semibold text-gray-800">Unidad:</span>
        <span className="ml-1 text-gray-700">{vehicle.name}</span>
      </div>
      <div className="flex items-center text-sm">
        <FaCogs className="text-gray-500 mr-2" />
        <span className="text-gray-600">Marca:</span>
        <span className="ml-1 text-gray-700">{vehicle.brand?.name}</span>
      </div>
      <div className="flex items-center text-sm">
        <FaCircle className="text-green-500 mr-2" />
        <span className="text-gray-600">Status:</span>
        <span className="ml-1 text-gray-700">{vehicle.status}</span>
      </div>
      <div className="flex items-center text-sm">
        <FaRegUser className="text-yellow-500 mr-2" />
        <span className="text-gray-600">Operador:</span>
        <span className="ml-1 text-gray-700">
          {vehicle.driver?.name || 'Sin asignar'}
        </span>
      </div>
      <div className="flex items-center text-sm">
        <CiBoxes className="text-purple-500 mr-2" />
        <span className="text-gray-600">Carga:</span>
        <span className="ml-1 text-gray-700">
          {vehicle.loadType || 'Sin asignar'}
        </span>
      </div>
    </div>
  );
};

export default VehicleMiniCard;

