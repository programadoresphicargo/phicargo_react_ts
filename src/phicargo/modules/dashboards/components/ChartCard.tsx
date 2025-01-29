import { ReactNode } from 'react';
import { Spinner } from '@nextui-org/react';

interface Props {
  title: ReactNode;
  children?: ReactNode;
  isLoading?: boolean;
  customHeight?: string;
}

export const ChartCard = ({
  children,
  title,
  isLoading,
  customHeight,
}: Props) => {
  const baseClassName =
    'bg-white border-2 border-slate-300 rounded-xl px-4 py-2 shadow-md flex flex-col';

  return (
    <div
      className={baseClassName}
      style={{ height: customHeight || '24rem' }}
    >
      <h2 className="text-base font-bold uppercase"> {title} </h2>
      <div className="flex-grow flex items-center justify-center">
        {!isLoading ? children : <Spinner />}
      </div>
    </div>
  );
};

