import { ReactNode } from 'react';
import { Spinner } from '@nextui-org/react';

type Color = 'blue' | 'green' | 'red' | 'yellow';

interface Props {
  title: ReactNode;
  color?: Color;
  value: ReactNode;
  description: ReactNode;
  isLoading?: boolean;
}

export const IndicatorCard = ({
  title,
  value,
  description,
  color,
  isLoading,
}: Props) => {
  let colorClass = '';
  if (color === 'blue') {
    colorClass = 'text-blue-600';
  } else if (color === 'green') {
    colorClass = 'text-green-600';
  } else if (color === 'red') {
    colorClass = 'text-red-600';
  } else if (color === 'yellow') {
    colorClass = 'text-yellow-600';
  }

  return (
    <div className="bg-white border-2 border-slate-300 rounded-xl p-3 shadow-md flex flex-col justify-between">
      <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <p className={`text-3xl font-bold ${colorClass} mt-2`}>{value}</p>
          <p className="text-sm text-slate-500 mt-2">{description}</p>
        </>
      )}
    </div>
  );
};
