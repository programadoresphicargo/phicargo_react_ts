import { FiAlertCircle } from 'react-icons/fi';
import { Spinner } from "@heroui/react";
import { useManeuverQueries } from '../hooks/useManeuverQueries';

interface Props {
  driverId: number;
}

export const ManeuverTimeline = ({ driverId }: Props) => {
  const {
    maneuverByDriverQuery: { data: maneuvers, isFetching },
  } = useManeuverQueries({ driverId });

  return (
    <>
      <h3 className="font-bold text-lg text-gray-800 mb-4">
        Últimas maniobras del operador
      </h3>
      <div className="space-y-6">
        {isFetching && <Spinner />}
        {maneuvers && maneuvers.length === 0 && (
          <div className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
            <FiAlertCircle className="text-gray-500 text-xl" />
            <span>
              No hay maniobras para este operador.
            </span>
          </div>
        )}
        {maneuvers &&
          maneuvers.length > 0 &&
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
          ))}
      </div>
    </>
  );
};

