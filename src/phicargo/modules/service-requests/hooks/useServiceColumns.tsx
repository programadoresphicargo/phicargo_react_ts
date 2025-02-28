import type { MRT_ColumnDef } from 'material-react-table';
import type { Waybill } from '../models';
import { useMemo } from 'react';

export const useServiceColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Waybill>[]>(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'state', header: 'Estado' },
      { accessorKey: 'branch.name', header: 'Sucursal' },
      { accessorKey: 'company.name', header: 'Empresa' },
      {
        accessorFn: (row) => row.dateOrder.format('DD/MM/YYYY'),
        header: 'Fecha Orden',
      },
      { accessorKey: 'clientOrderRef', header: 'Referencia Cliente' },
      { accessorKey: 'category.name', header: 'Categoria' },
      { accessorKey: 'client.name', header: 'Cliente' },
      { accessorKey: 'xRutaBel', header: 'Ruta prog' },
      { accessorKey: 'xTipoBel', header: 'Tipo Armado' },
      { accessorKey: 'xModoBel', header: 'Modo' },
      { accessorKey: 'xCustodiaBel', header: 'Custodia' },
      { accessorKey: 'departureAddress.name', header: 'Dirección Origen' },
    ],
    [],
  );

  return columns;
};

