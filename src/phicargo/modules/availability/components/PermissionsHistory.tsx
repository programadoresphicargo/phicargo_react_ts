import { Dayjs } from 'dayjs';
import { DriverUnavailable } from '../models/driver-unavailability';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { Tooltip } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

interface Props {
  unavailabilities: DriverUnavailable[];
}

export const PermissionsHistory = ({ unavailabilities }: Props) => {
  const navigate = useNavigate();

  const onOpenDocument = (id: number, startDate: Dayjs, endDate: Dayjs) => {
    const start = startDate.format('YYYY-MM-DD');
    const end = endDate.format('YYYY-MM-DD');

    navigate(
      `/disponibilidad/operadores/solicitud-vacaciones/${id}?start=${start}&end=${end}`,
    );
  };

  return (
    <div className="space-y-3">
      {unavailabilities.map((event, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
            <div className="ml-4">
              <p className="text-sm uppercase font-bold">{event.reasonType}</p>
              <p className="text-xs text-neutral-800">
                {event.startDate.format('DD/MM/YYYY')} -{' '}
                {event.endDate.format('DD/MM/YYYY')}
              </p>
            </div>
          </div>
          <Tooltip content="Ver PDF">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() =>
                onOpenDocument(event.employeeId, event.startDate, event.endDate)
              }
            >
              <IoDocumentTextOutline className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

