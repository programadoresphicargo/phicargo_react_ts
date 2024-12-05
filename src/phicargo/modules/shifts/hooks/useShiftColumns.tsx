import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Shift } from '../models';

export const useShiftColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Shift>[]>(
    () => [
      { accessorKey: 'shift', header: 'Turno' },
      { accessorKey: 'driver.name', header: 'Operador' },
      { accessorKey: 'driver.name', header: 'Operador' },
      { accessorKey: 'driver.license', header: 'Licencia' },
      { accessorKey: 'driver.isDangerous', header: 'Peligroso' },
      { accessorKey: 'driver.isDangerous', header: 'Peligroso' },
    ],
    [],
  );

  return {
    columns,
  };
};
