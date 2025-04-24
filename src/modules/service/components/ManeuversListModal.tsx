import { Alert } from '@/components/ui';
import { FaCalendarMinus } from 'react-icons/fa';
import { Maneuver } from '../models';
import { SimpleModal } from '@/components';

interface Props {
  open: boolean;
  onClose: () => void;
  maneuvers: Maneuver[];
}

export const ManeuversListModal = ({ open, onClose, maneuvers }: Props) => {
  return (
    <SimpleModal
      isOpen={open}
      onOpenChange={onClose}
      header="Maniobras del Servicio"
    >
      <div className="p-4">
        {maneuvers.length === 0 && (
          <Alert color="primary" title="No hay maniobras en este servicio" />
        )}

        <ol className="relative border-s border-gray-200">
          {maneuvers.map((item) => (
            <li className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
                <FaCalendarMinus className="w-2.5 h-2.5 text-blue-800" />
              </span>
              <span className="flex items-center mb-1 text-lg font-semibold uppercase text-gray-900">
                {item.type}
                <span className=" text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-lg bg-blue-900 dark:text-blue-300 ms-3">
                  {item.status}
                </span>
              </span>
              <div className="block mb-2 text-medium font-normal leading-none text-gray-600 uppercase">
                <span className="block text-gray-500 text-sm">
                  Programado:{' '}
                  <time className="time">
                    {item.scheduledStart.format('DD/MM/YYYY hh:mm A')}
                  </time>
                </span>
                <span className="text-gray-500 text-sm">
                  Activada:{' '}
                  <time className="time">
                    {item.activationDate?.format('DD/MM/YYYY hh:mm A')}
                  </time>
                </span>
              </div>
              <span className='block text-sm'>Operador: {item.driver}</span>
              <span className='text-sm'>Unidad: {item.vehicle}</span>
            </li>
          ))}
        </ol>
      </div>
    </SimpleModal>
  );
};

