import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Incident } from '../models';
import { BasicTextCell } from '@/components/ui';
import { Chip, Tooltip } from '@mui/material';
import { incidentType } from '../utilities';

export const useIncidentsColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Incident>[]>(
    () => [
      {
        accessorFn: (row) => row.incident,
        header: 'Incidencia',
        id: 'incident',
        maxSize: 50,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return <BasicTextCell value={value} />;
        },
      },
      {
        accessorFn: (row) => row.driver.name,
        header: 'Operador',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return <BasicTextCell value={value} />;
        },
      },
      {
        accessorFn: (row) => row.type,
        header: 'Tipo',
        maxSize: 50,
        Cell: ({ row }) => {
          const value = row.original.type;
          return (
            <Chip
              label={incidentType.getLabel(value)}
              color={incidentType.getColor(value)}
              size="small"
              variant="outlined"
            />
          );
        },
      },
      {
        accessorFn: (row) => row.comments,
        header: 'Comentarios',
        maxSize: 50,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return (
            <Tooltip title={value} placement="top" arrow>
              <span className="font-bold uppercase">
                {`${value.slice(0, 45)}...`}
              </span>
            </Tooltip>
          );
        },
      },
      {
        accessorFn: (row) => row.incidentDate,
        header: 'Fecha de Incidencia',
        maxSize: 50,
        Cell: ({ row }) => {
          const value = row.original.incidentDate?.format('DD/MM/YYYY hh:mm A');
          return <BasicTextCell value={value} />;
        },
      },
      {
        accessorFn: (row) => row.user.username,
        header: 'Usuario',
        maxSize: 50,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return <BasicTextCell value={value} />;
        },
      },
      {
        accessorFn: (row) => row.createdAt,
        header: 'Fecha de Creación',
        maxSize: 50,
        Cell: ({ row }) => {
          const value = row.original.createdAt.format('DD/MM/YYYY hh:mm A');
          return <BasicTextCell value={value} />;
        },
      },
      {
        header: 'Evidencias',
        id: 'evidences',
        Cell: ({ row }) => {
          const value = row.original.evidences.length;
          return <BasicTextCell value={value} fallback="Sin evidencias" />;
        },
      },
    ],
    [],
  );

  return columns;
};

