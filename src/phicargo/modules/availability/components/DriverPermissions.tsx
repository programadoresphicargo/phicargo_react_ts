import { Button, Card, CardBody, CardHeader, Spinner } from '@nextui-org/react';

import { IoIosAddCircle } from 'react-icons/io';
import { PermissionsHistory } from './PermissionsHistory';
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
            onPress={() => setIsOpen(true)}
          >
            <IoIosAddCircle />
          </Button>
        </CardHeader>
        <CardBody className="p-4 overflow-y-auto">
          {isFetching ? (
            <Spinner size="sm" />
          ) : unavailabilities && unavailabilities.length > 0 ? (
            <PermissionsHistory unavailabilities={unavailabilities} />
          ) : (
            <p className="text-sm text-gray-500">
              No hay permisos registrados.
            </p>
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

