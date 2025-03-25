import type { Driver, DriverUnavailable } from '../../models';

import { AlertDialog } from '@/components';
import { FaCalendarMinus } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { IoMdExit } from 'react-icons/io';
import { Tooltip } from '@heroui/react';
import VacationsRequestView from './VacationsRequestView';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useUnavailabilityQueries } from '../../hooks/queries';

interface Props {
  driver: Driver;
  unavailabilities: DriverUnavailable[];
}

export const UnavailabilitiesTimeline = ({
  unavailabilities,
  driver,
}: Props) => {
  const [toVacationRequest, setToVacationRequest] =
    useState<DriverUnavailable | null>(null);

  const [itemSelected, setItemSelected] = useState<DriverUnavailable | null>(
    null,
  );

  const { releaseDriverUnavailabilityMutation } = useUnavailabilityQueries(
    itemSelected?.employeeId,
  );

  const onRelease = () => {
    if (!itemSelected) return;
    releaseDriverUnavailabilityMutation.mutate(itemSelected.id);
  };

  return (
    <>
      <div className="p-4">
        <ol className="relative border-s border-gray-200">
          {unavailabilities.map((item, index) => (
            <li className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
                <FaCalendarMinus className="w-2.5 h-2.5 text-blue-800" />
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                {item.reasonType}
                {index === 0 && (
                  <span className=" text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-lg bg-blue-900 dark:text-blue-300 ms-3">
                    Última
                  </span>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  {item.reasonType === 'vacaciones' && item.vacationDocId && (
                    <Tooltip content="Ver PDF">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setToVacationRequest(item)}
                      >
                        <IoDocumentTextOutline className="w-5 h-5" />
                      </button>
                    </Tooltip>
                  )}
                  <AlertDialog
                    title="Liberar"
                    message="¿Está seguro que desea liberar esta solicitud?"
                    onConfirm={() => onRelease()}
                    iconOnly
                    onOpenChange={(isOpen) =>
                      setItemSelected(isOpen ? item : null)
                    }
                    open={itemSelected?.id === item.id}
                    tooltipMessage="Liberar"
                    openButtonIcon={<IoMdExit className="text-xl" />}
                    openDisabled={!item.endDate.isAfter(dayjs())}
                  />
                </div>
              </h3>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-600 uppercase">
                {item?.startDate?.format('DD/MM/YYYY')} -{' '}
                {item?.endDate?.format('DD/MM/YYYY')}
              </time>
              <p className="mb-4 text-base font-normal text-gray-500">
                <p className="text-sm text-gray-600">{item?.description}</p>
              </p>
            </li>
          ))}
        </ol>
      </div>
      {toVacationRequest && (
        <VacationsRequestView
          open={Boolean(toVacationRequest)}
          onClose={() => setToVacationRequest(null)}
          driver={driver}
          unavailability={toVacationRequest}
        />
      )}
    </>
  );
};

