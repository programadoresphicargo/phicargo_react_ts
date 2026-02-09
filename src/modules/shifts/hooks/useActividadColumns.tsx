import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Actividad } from '../models';

export const useActividadColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Actividad>[]>(
    () => [
      {
        accessorFn: (row) => row.driver,
        header: 'Operador',
      },
      {
        accessorFn: (row) => row.vehicle,
        header: 'Vehículo',
      },
      {
        accessorFn: (row) => row.ruta,
        header: 'Ruta',
      },
      {
        accessorFn: (row) => row.fecha_finalizado,
        header: 'Fecha finalizado',
      },
      {
        accessorFn: (row) => row.dias_transcurridos,
        header: 'Días transcurridos',
      },
    ],
    [],
  );

  return {
    columns,
  };
};

