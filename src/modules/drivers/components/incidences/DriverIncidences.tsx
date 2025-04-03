import { Alert, LoadingSpinner } from '@/components/ui';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

import type { Driver } from '../../models';
import { IncidenceCreateModal } from './IncidenceCreateModal';
import { IncidencesTimeline } from './IncidencesTimeline';
import { IoIosAddCircle } from 'react-icons/io';
import { useGetDriverIncidence } from '../../hooks/queries';
import { useState } from 'react';

interface Props {
  driver: Driver;
}

export const DriverIncidences = (props: Props) => {
  const { driver } = props;

  const [isOpen, setIsOpen] = useState(false);

  const { driverIncidences } = useGetDriverIncidence(driver.id);

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
              Incidencias del Operador
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
          {driverIncidences.isFetching ? (
            <LoadingSpinner />
          ) : driverIncidences.data && driverIncidences.data.length > 0 ? (
            <IncidencesTimeline incidences={driverIncidences.data} />
          ) : (
            <Alert
              color="primary"
              title="No hay incidencias registradas"
            />
          )}
        </CardBody>
      </Card>
      <IncidenceCreateModal 
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(!isOpen)}
        driverId={driver.id}
      />
    </>
  );
};

