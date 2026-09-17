import { BsBusFrontFill } from 'react-icons/bs';
import { FaRegUserCircle } from 'react-icons/fa';
import { FaWarehouse } from 'react-icons/fa';
import type { MaintenanceRecord } from '../models';
import { MdOutlineSmsFailed } from 'react-icons/md';
import dayjs from 'dayjs';

interface Props {
  record: MaintenanceRecord;
}

export const RecordInfo = ({ record }: Props) => {
  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-medium">
        <div className="flex items-center">
          <BsBusFrontFill className="mr-2 text-blue-500" />

          <span className="font-semibold text-gray-800">
            Unidad:
          </span>

          <span className="ml-1 text-gray-700">
            {record?.vehicle.name}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <span className="font-medium">
            Coordenadas:
          </span>

          <span className="ml-1">
            {record?.vehicle.latitude}, {record?.vehicle.longitude}
          </span>
        </div>

        {record?.vehicle.latitude && record?.vehicle.longitude && (
          <a
            href={`https://www.google.com/maps?q=${record.vehicle.latitude},${record.vehicle.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
          >
            Ver ubicación
          </a>
        )}

        {record?.vehicle.last_position_update &&
          dayjs(record.vehicle.last_position_update).isValid() && (
            <span className="text-sm text-gray-400">
              Actualizado:{" "}
              {dayjs(record.vehicle.last_position_update)
                .subtract(6, "hour")
                .format("DD/MM/YYYY h:mma")}
            </span>
          )}
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

