import { Driver } from '../models/driver-model';
import { DriverUnavailable } from '../models/driver-unavailability';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { Tooltip } from "@heroui/react";
import VacationsRequestView from './VacationsRequestView';
import { useState } from 'react';

interface Props {
  driver: Driver;
  unavailabilities: DriverUnavailable[];
}

export const PermissionsHistory = ({ unavailabilities, driver }: Props) => {
  const [toVacationRequest, setToVacationRequest] =
    useState<DriverUnavailable | null>(null);

  return (
    <>
      <div className="space-y-3">
        {unavailabilities.map((event, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
              <div className="ml-4">
                <p className="text-sm uppercase font-bold">
                  {event.reasonType}
                </p>
                <p className="text-xs text-neutral-800">
                  {event.startDate.format('DD/MM/YYYY')} -{' '}
                  {event.endDate.format('DD/MM/YYYY')}
                </p>
              </div>
            </div>
            {event.reasonType === 'vacaciones' && event.vacationDocId && (
              <Tooltip content="Ver PDF">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setToVacationRequest(event)}
                >
                  <IoDocumentTextOutline className="w-5 h-5" />
                </button>
              </Tooltip>
            )}
          </div>
        ))}
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

