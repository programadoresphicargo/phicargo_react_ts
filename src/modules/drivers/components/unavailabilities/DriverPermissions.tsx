import { Alert, LoadingSpinner, RefreshButton } from '@/components/ui';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

import type { Driver } from '../../models';
import { IoIosAddCircle } from 'react-icons/io';
import { UnavailabilitiesTimeline } from './UnavailabilitiesTimeline';
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
    driverUnavailabilityQuery: { data: unavailabilities, isFetching, refetch },
  } = useUnavailabilityQueries(driver.id);

  return (
    <>
      <Card
        classNames={{
          base: 'shadow-none',
          header: 'bg-gray-200 px-4 py-1',
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
          <div className="flex items-center gap-2">
            <RefreshButton onRefresh={() => refetch()} isLoading={isFetching} />
            <Button
              color="primary"
              variant="light"
              className="text-2xl"
              isIconOnly
              onPress={() => setIsOpen(true)}
            >
              <IoIosAddCircle />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {isFetching ? (
            <LoadingSpinner />
          ) : unavailabilities && unavailabilities.length > 0 ? (
            <UnavailabilitiesTimeline
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

