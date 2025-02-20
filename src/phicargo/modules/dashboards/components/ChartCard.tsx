import { Button, Spinner, Tooltip } from "@heroui/react";

import type { ChartActions } from '../types';
import { FaFileDownload } from 'react-icons/fa';
import { ReactNode } from 'react';

interface Props {
  title: ReactNode;
  children?: ReactNode;
  isLoading?: boolean;
  customHeight?: string;
  downloadFn?: () => void;
  actions?: ChartActions[];
}

export const ChartCard = ({
  children,
  title,
  isLoading,
  customHeight,
  downloadFn,
  actions,
}: Props) => {
  const baseClassName =
    'bg-white border-2 border-slate-300 rounded-xl px-4 py-2 shadow-md flex flex-col';

  return (
    <div className={baseClassName} style={{ height: customHeight || '24rem' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold uppercase"> {title} </h2>
        <div className="flex space-x-2">
          {downloadFn && (
            <Tooltip content="Descargar Datos" placement="top">
              <Button
                isIconOnly
                aria-label="download-excel"
                color="success"
                size="sm"
                variant="light"
                className="p-0"
                onPress={downloadFn}
              >
                <FaFileDownload className="text-lg" />
              </Button>
            </Tooltip>
          )}
          {actions?.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant="faded"
              color="primary"
              onPress={action.handler}
            >
              {action.action}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center">
        {!isLoading ? children : <Spinner />}
      </div>
    </div>
  );
};

