import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Incident } from '../models';

export const useIncidentsColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Incident>[]>(
    () => [
      {
        accessorFn: (row) => row.incident,
        header: 'Incidencia',
        id: 'incident',
        maxSize: 50,
      },
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
        accessorFn: (row) => row.type,
        header: 'Tipo',
        maxSize: 50,
      },
      {
        accessorFn: (row) => row.comments,
        header: 'Comentarios',
        maxSize: 50,
      },
      {
        accessorFn: (row) => row.user.username,
        header: 'Usuario',
        maxSize: 50,
      },
      {
        accessorFn: (row) => row.createdAt,
        header: 'Fecha de Creación',
        maxSize: 50,
        Cell: ({ row }) => row.original.createdAt.format('DD/MM/YYYY hh:mm A'),
      },
    ],
    [],
  );

  return columns;
};

