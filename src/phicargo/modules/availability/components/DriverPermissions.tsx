import { Button, Card, CardBody, CardHeader, Spinner } from '@nextui-org/react';

import { IoIosAddCircle } from 'react-icons/io';
import UnavailiabilityCreateModal from './UnavailiabilityCreateModal';
import { useState } from 'react';
import { useUnavailabilityQueries } from '../hooks/useUnavailabilityQueries';

interface Props {
  driverId: number;
}

const DriverPermissions = (props: Props) => {
  const { driverId } = props;

  const [isOpen, setIsOpen] = useState(false);

  const {
    driverUnavailabilityQuery: { data: unavailabilities, isFetching },
  } = useUnavailabilityQueries({ driverId });

  return (
    <>
      <Card className="border max-h-96">
        <CardHeader className="flex items-center justify-between bg-gray-100">
          <div>
            <h3 className="font-bold text-lg">Historial de Permisos</h3>
          </div>
          <Button
            color="primary"
            variant="light"
            className="text-2xl"
            isIconOnly
            onClick={() => setIsOpen(true)}
          >
            <IoIosAddCircle/>
          </Button>
        </CardHeader>
        <CardBody className="p-4 overflow-y-auto">
          {isFetching ? (
            <Spinner size="sm" />
          ) : unavailabilities && unavailabilities.length > 0 ? (
            <div className="space-y-3">
              {unavailabilities.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
                  <div className="ml-4">
                    <p className="text-sm uppercase font-bold">{event.reasonType}</p>
                    <p className="text-xs text-neutral-800">
                      {event.startDate.format('DD/MM/YYYY')} -{' '}
                      {event.endDate.format('DD/MM/YYYY')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay permisos registrados.</p>
          )}
        </CardBody>
      </Card>
      <UnavailiabilityCreateModal
        driverId={driverId}
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(!isOpen)}
      />
    </>
  );
};

export default DriverPermissions;
