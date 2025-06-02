import { Alert, LoadingSpinner } from '@/components/ui';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

import type { Driver } from '../../models';
import { IncidenceCreateModal } from './IncidenceCreateModal';
import { IncidencesTimeline } from './IncidencesTimeline';
import { IoIosAddCircle } from 'react-icons/io';
import { useState } from 'react';
import { useGetDriverIncidents } from '@/modules/incidents/hooks/quries';

interface Props {
  driver: Driver;
}

export const DriverIncidences = (props: Props) => {
  const { driver } = props;

  const [isOpen, setIsOpen] = useState(false);

  const { driverIncidents } = useGetDriverIncidents(driver.id);

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
          {driverIncidents.isFetching ? (
            <LoadingSpinner />
          ) : driverIncidents.data && driverIncidents.data.length > 0 ? (
            <IncidencesTimeline incidents={driverIncidents.data} />
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

