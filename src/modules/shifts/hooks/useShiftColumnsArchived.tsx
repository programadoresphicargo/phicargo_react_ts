import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Shift } from '../models';
import { Chip } from "@heroui/react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import dayjs from 'dayjs';

export const useShiftColumnsArchived = () => {
  const columns = useMemo<MRT_ColumnDef<Shift>[]>(
    () => [
      {
        accessorFn: (row) => row.driver.name,
        header: 'Operador',
        Cell: ({ cell }) => (
          <span className="text-sm font-semibold">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.driver.modality || 'SIN ASIGNAR',
        header: 'Licencia',
        maxSize: 50,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return (
            <Chip color={value === 'full' ? 'primary' : 'warning'} size="sm" className='text-white'>
              {cell.getValue<string>()}
            </Chip>
          );
        },
      },
      {
        accessorFn: (row) => row.vehicle.name,
        header: 'Unidad',
        Cell: ({ cell }) => (
          <span className="text-sm font-semibold text-blue-600">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.arrivalAt.format('DD/MM/YYYY hh:mm A'),
        header: 'Llegada',
      },
      {
        accessorFn: (row) => row.comments,
        header: 'Comentarios',
      },
      {
        accessorFn: (row) => row.cp_assigned,
        header: 'Viaje programado',
      },
      {
        accessorFn: (row) => row.archivedReason,
        header: 'Motivo',
      },
      {
        accessorFn: (row) => row.archivedDate?.format('DD/MM/YYYY hh:mm A'),
        header: 'Archivado',
      },
    ],
    [],
  );

  return {
    columns,
  };
};

