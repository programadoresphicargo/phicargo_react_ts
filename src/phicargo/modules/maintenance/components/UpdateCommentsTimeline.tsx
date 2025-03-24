import { FaCalendarMinus } from 'react-icons/fa';
import type { RecordUpdateComment } from '../models';

interface Props {
  comments: RecordUpdateComment[];
}

export const UpdateCommentsTimeline = ({ comments }: Props) => {
  return (
    <div className="p-4">
      <ol className="relative border-s border-gray-200">
        {comments.map((comment, index) => (
          <li className="mb-10 ms-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
              <FaCalendarMinus className="w-2.5 h-2.5 text-blue-800" />
            </span>
            <time className="flex items-center mb-1 text-lg font-semibold uppercase text-gray-900">
              {comment.changeDate.format('MMMM DD, YYYY | HH:mm A')}
              {index === 0 && (
                <span className=" text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-lg bg-blue-900 dark:text-blue-300 ms-3">
                  Último Cambio
                </span>
              )}
            </time>
            <span className="block mb-2 text-medium font-normal leading-none text-gray-600 uppercase">
              Por: <span className="font-bold">{comment.byUser.name}</span>{' | '}
              <time className="time">
                {comment.previousDeliveryDate.format('DD/MM/YYYY')}
              </time>
              {' ➡︎ '}
              <time className="font-bold">
                {comment.newDeliveryDate.format('DD/MM/YYYY')}
              </time>
            </span>
            <p className="mb-4 text-base font-normal text-gray-600 uppercase">
              {comment.comment}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

