import { Button } from '@heroui/react';
import { MuiSimpleModal } from '@/components';
import { useGetDaysOffQuery } from '../../hooks/queries';
import { FaCalendarMinus } from 'react-icons/fa';
import { Alert, LoadingSpinner } from '@/components/ui';

interface Props {
  open: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
}

export const ShowDaysOffModal = ({ open, onClose, startDate, endDate }: Props) => {
  const {
    getDaysOffQuery: { isLoading, data },
  } = useGetDaysOffQuery({startDate, endDate});

  return (
    <MuiSimpleModal
      open={open}
      onClose={onClose}
      header="Crear Día Inhábil"
      customFooter={
        <>
          <Button
            variant="light"
            color="danger"
            size="sm"
            radius="full"
            onPress={onClose}
          >
            Cancelar
          </Button>
        </>
      }
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
                  {item.type}
                  {index === 0 && (
                    <span className=" text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-lg bg-blue-900 dark:text-blue-300 ms-3">
                      Último Cambio
                    </span>
                  )}
                </span>
                <span className="block mb-2 text-medium font-normal leading-none text-gray-600 uppercase">
                  <>
                    <time className="time">
                      {item.dateOff.format('DD/MM/YYYY')}
                    </time>
                  </>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </MuiSimpleModal>
  );
};

