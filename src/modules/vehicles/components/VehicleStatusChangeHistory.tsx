import { Alert, LoadingSpinner } from '@/components/ui';

import { FaCalendarMinus } from 'react-icons/fa';
import { SimpleModal } from '@/components';
import { useGetVehicleStatusChangeHistoryQuery } from '../hooks/queries/useGetVehicleStatusChangeHistoryQuery';

interface Props {
  open: boolean;
  onClose: () => void;
  vehicleId: number;
}

export const VehicleStatusChangeHistory = ({
  open,
  onClose,
  vehicleId,
}: Props) => {
  const {
    getVehicleStatusChangeHistory: { data, isLoading },
  } = useGetVehicleStatusChangeHistoryQuery(vehicleId, open);

  return (
    <SimpleModal
      isOpen={open}
      onOpenChange={onClose}
      header="Historial de Cambios de Estado"
    >
      <div className="p-4">
        {isLoading && <LoadingSpinner />}
        {data && data.length === 0 && (
          <Alert
            color="primary"
            title="No hay historial de cambios de estado"
          />
        )}
        {data && data.length > 0 && (
          <ol className="relative border-s border-gray-200">
            {data?.map((item, index) => (
              <li className="mb-10 ms-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
                  <FaCalendarMinus className="w-2.5 h-2.5 text-blue-800" />
                </span>
                <span className="flex items-center mb-1 text-lg font-semibold uppercase text-gray-900">
                  {item.status}
                  {index === 0 && (
                    <span className=" text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-lg bg-blue-900 dark:text-blue-300 ms-3">
                      Último Cambio
                    </span>
                  )}
                </span>
                <span className="block mb-2 text-medium font-normal leading-none text-gray-600 uppercase">
                  <>
                    <time className="time">
                      {item.startDate.format('DD/MM/YYYY')}
                    </time>
                    {item.endDate && (
                      <>
                        {' ➡︎ '}
                        <time className="font-bold">
                          {item.endDate.format('DD/MM/YYYY')}
                        </time>
                      </>
                    )}
                  </>
                </span>
                {item.deliveryDate && (
                  <span className="block mb-2 text-medium font-normal leading-none text-gray-600 uppercase">
                    Fecha de entrega:{' '}
                    <time className="time">
                      {item.deliveryDate.format('DD/MM/YYYY')}
                    </time>
                  </span>
                )}
                {item.previousStatus && (
                  <p className="mb-4 text-base font-normal text-gray-600 uppercase">
                    Previo:{' '}
                    <span className="font-bold"> {item.previousStatus}</span>
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </SimpleModal>
  );
};

