import { Alert, Card, CardBody, CardHeader } from '@heroui/react';

import { LoadingSpinner } from '@/components/ui';
import { MenuversTimeline } from './MenuversTimeline';
import { useManeuverQueries } from '../../hooks/queries';

interface Props {
  driverId: number;
}

export const DriverManeuver = ({ driverId }: Props) => {
  
  const {
    maneuverByDriverQuery: { data: maneuvers, isFetching },
  } = useManeuverQueries({ driverId });

  return (
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
            Últimas maniobras del operador
          </h3>
        </div>
      </CardHeader>
      <CardBody>
        {isFetching ? (
          <LoadingSpinner />
        ) : maneuvers && maneuvers.length > 0 ? (
          <MenuversTimeline maneuvers={maneuvers} />
        ) : (
          <Alert color="warning" title="No hay maniobras para este operador" />
        )}
      </CardBody>
    </Card>
  );
};

