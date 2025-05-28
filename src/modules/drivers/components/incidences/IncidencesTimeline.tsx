import { FaCalendarMinus } from 'react-icons/fa';
import type { Incidence } from '../../models';
import { incidenceType } from '../../../incidents/utilities';

interface Props {
  incidences: Incidence[];
}

export const IncidencesTimeline = ({ incidences }: Props) => {
  return (
    <div className="p-4">
      <ol className="relative border-s border-gray-200">
        {incidences.map((incidence) => (
          <li className="mb-10 ms-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
              <FaCalendarMinus className="w-2.5 h-2.5 text-blue-800" />
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
              {incidence.incidence}
              <span className=" text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-lg bg-blue-900 dark:text-blue-300 ms-3">
                {incidenceType.getLabel(incidence.type)}
              </span>
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-600 uppercase">
              {incidence.createdAt.format('MMMM DD, YYYY')}
            </time>
            <p className="mb-4 text-base font-normal text-gray-500">
              {incidence.comments}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

