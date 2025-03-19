import { Alert, Card, CardBody, CardHeader } from '@heroui/react';

import { LoadingSpinner } from '@/components/ui';
import { useManeuverQueries } from '../hooks/queries';

interface Props {
  driverId: number;
}

export const ManeuverDriverTimeline = ({ driverId }: Props) => {
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
          maneuvers.map((maneuver) => (
            <div className="relative pl-6">
              <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="font-medium text-gray-700">
                Maniobra M-{maneuver.id}
              </p>
              <p className="text-sm text-gray-500">
                Inicio programado:{' '}
                {maneuver?.programmedStart?.format('YYYY/MM/DD hh:mma A')}
              </p>
              <div className="mt-2 pl-4 border-l-2 border-gray-300">
                <p className="text-sm text-gray-600">Tipo: {maneuver?.type}</p>
                <p className="text-sm text-gray-600">
                  Terminal: {maneuver?.terminal.name}
                </p>
                <p className="text-sm text-gray-600">
                  Vehículo: {maneuver?.vehicle.name}
                </p>
              </div>
            </div>
          ))
        ) : (
          <Alert color="warning" title="No hay maniobras para este operador" />
        )}
      </CardBody>
    </Card>
  );
};

