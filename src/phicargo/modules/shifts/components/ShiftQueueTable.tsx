import { IconButton, Tooltip } from '@mui/material';
import { ReactNode, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';

import { BiUserMinus } from 'react-icons/bi';
import { Queue } from '../models';
import { useShiftQueueQueries } from '../hooks/useShiftQueueQueries';

const columns = [
  {
    key: 'driver',
    label: 'OPERADOR',
  },
  {
    key: 'arrivalAt',
    label: 'LLEGADA',
  },
  {
    key: 'enqueueDate',
    label: 'FECHA DE ENCOLAMIENTO',
  },
  {
    key: 'releaseDate',
    label: 'FECHA DE LIBERACIÓN',
  },
  {
    key: 'comments',
    label: 'COMENTARIOS',
  },
  {
    key: 'actions',
    label: 'ACCIONES',
  },
];

interface Props {
  queues: Queue[];
  isLoading: boolean;
}

export const ShiftQueueTable = ({ queues, isLoading }: Props) => {

  const { releaseQueue } = useShiftQueueQueries();


  const renderCell = useCallback((queue: Queue, columnKey: React.Key) => {
    const cellValue = queue[columnKey as keyof Queue];

    const onReleaseQueue = () => {
      releaseQueue.mutate(queue.id);
    }

    switch (columnKey) {
      case 'driver':
        return queue?.shift?.driver.name;
      case 'arrivalAt':
        return queue.shift.arrivalAt.format('DD/MM/YYYY HH:mm A');
      case 'enqueueDate':
        return queue.enqueueDate.format('DD/MM/YYYY HH:mm A');
      case 'releaseDate':
        return queue.releaseDate?.format('DD/MM/YYYY HH:mm A');
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip arrow title="Liberar">
              <IconButton 
                sx={{ padding: 0 }} 
                onClick={() => onReleaseQueue()}
              >
                <BiUserMinus className='text-blue-600' />
              </IconButton>
            </Tooltip>
          </div>
        );
      default:
        return cellValue as ReactNode;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        items={queues}
        emptyContent={'Sin operadores en cola'}
        isLoading={isLoading}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

