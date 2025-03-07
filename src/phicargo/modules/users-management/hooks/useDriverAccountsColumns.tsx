import { Driver } from '../../availability/models/driver-model';
import { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';

export const useDriverAccountsColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Driver>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID Usuario',
      },
      {
        accessorFn: (row) => row.company?.name,
        header: 'Empresa',
      },
      {
        accessorKey: 'name',
        header: 'Operador',
      },
    ],
    [],
  );

  return columns;
};

