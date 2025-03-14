import { Button, Card, CardBody, CardHeader, Spinner } from "@heroui/react";

import { Driver } from '../models/driver-model';
import { IoIosAddCircle } from 'react-icons/io';
import { PermissionsHistory } from './PermissionsHistory';
import UnavailiabilityCreateModal from './UnavailiabilityCreateModal';
import { useState } from 'react';
import { useUnavailabilityQueries } from '../hooks/useUnavailabilityQueries';

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
      <Card className="border max-h-96">
        <CardHeader className="flex items-center justify-between bg-gray-100">
          <div>
            <h3 className="font-bold text-lg">Historial de Permisos / Castigos</h3>
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
            <PermissionsHistory driver={driver} unavailabilities={unavailabilities} />
          ) : (
            <p className="text-sm text-gray-500">
              No hay permisos o castigos registrados.
            </p>
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

