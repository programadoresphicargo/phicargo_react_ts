import { Alert, LoadingSpinner } from '@/components/ui';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

import type { Driver } from '../../models';
import { IoIosAddCircle } from 'react-icons/io';
import { PermissionsHistory } from './PermissionsHistory';
import UnavailiabilityCreateModal from './UnavailiabilityCreateModal';
import { useState } from 'react';
import { useUnavailabilityQueries } from '../../hooks/queries';

interface Props {
  driver: Driver;
}

const DriverPermissions = (props: Props) => {
  const { driver } = props;

  const [isOpen, setIsOpen] = useState(false);

  const {
    driverUnavailabilityQuery: { data: unavailabilities, isFetching },
  } = useUnavailabilityQueries({ driverId: driver.id });

  return (
    <>
      <Card
        classNames={{
          base: 'shadow-none',
          header: 'bg-gray-100 px-4 py-1',
          body: 'overflow-y-auto h-80',
        }}
        radius="md"
      >
        <CardHeader className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-800 font-bold text-lg">
              Historial de Permisos / Castigos
            </h3>
          </div>
          <Button
            color="primary"
            variant="light"
            className="text-2xl"
            isIconOnly
            onPress={() => setIsOpen(true)}
          >
            <IoIosAddCircle />
          </Button>
        </CardHeader>
        <CardBody>
          {isFetching ? (
            <LoadingSpinner />
          ) : unavailabilities && unavailabilities.length > 0 ? (
            <PermissionsHistory
              driver={driver}
              unavailabilities={unavailabilities}
            />
          ) : (
            <Alert
              color="primary"
              title="No hay permisos ni castigos para este operador"
            />
          )}
        </CardBody>
      </Card>
      <UnavailiabilityCreateModal
        driverId={driver.id}
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(!isOpen)}
      />
    </>
  );
};

export default DriverPermissions;

