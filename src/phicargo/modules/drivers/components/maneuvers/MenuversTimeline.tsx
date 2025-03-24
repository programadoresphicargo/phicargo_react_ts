import { FaCalendarMinus } from 'react-icons/fa';
import type { Maneuver } from '../../models';

interface Props {
  maneuvers: Maneuver[];
}

export const MenuversTimeline = ({ maneuvers }: Props) => {
  return (
    <div className="p-4">
      <ol className="relative border-s border-gray-200">
        {maneuvers.map((maneuver, index) => (
          <li className="mb-10 ms-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
              <FaCalendarMinus className="w-2.5 h-2.5 text-blue-800" />
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
              Maniobra M-{maneuver.id}
              {index === 0 && (
                <span className=" text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-lg bg-blue-900 dark:text-blue-300 ms-3">
                  Última
                </span>
              )}
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-600 uppercase">
              Inicio programado:{' '}
              {maneuver?.programmedStart?.format('YYYY/MM/DD hh:mm A')}
            </time>
            <p className="mb-4 text-base font-normal text-gray-500">
              <p className="text-sm text-gray-600">
                Tipo:{' '}
                <span className="font-bold uppercase">{maneuver?.type}</span>{' '}
              </p>
              <p className="text-sm text-gray-600">
                Terminal:{' '}
                <span className="font-bold uppercase">
                  {maneuver?.terminal.name}
                </span>{' '}
              </p>
              <p className="text-sm text-gray-600">
                Unidad:{' '}
                <span className="font-bold uppercase">
                  {maneuver?.vehicle.name}
                </span>{' '}
              </p>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

