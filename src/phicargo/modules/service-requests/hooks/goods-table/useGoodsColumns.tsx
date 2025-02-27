import type { ComplementCpCreate } from '../../models';
import type { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';

export const useGoodsColumns = () => {
  const columns = useMemo<MRT_ColumnDef<ComplementCpCreate>[]>(
    () => [
      {
        accessorFn: (row) => row.description,
        header: 'Descripción',
        id: 'description',
      },
      {
        accessorFn: (row) => row.dimensionsCharge,
        header: 'Dimensiones',
        id: 'dimensionsCharge',
      },
      {
        accessorFn: (row) => row.satProductId,
        header: 'Producto SAT',
        id: 'satProductId',
      },
      {
        accessorFn: (row) => row.quantity,
        header: 'Cantidad',
        id: 'quantity',
      },
      {
        accessorFn: (row) => row.satUomId,
        header: 'UDM SAT',
        id: 'satUomId',
      },
      {
        accessorFn: (row) => row.weightCharge,
        header: 'Peso',
        id: 'weightCharge',
      },
      {
        accessorFn: (row) => row.hazardousMaterial,
        header: 'Es peligroso',
        id: 'hazardousMaterial',
      },
      {
        accessorFn: (row) => row.hazardousKeyProductId,
        header: 'Clave de material peligroso',
        id: 'hazardousKeyProductId',
      },
      {
        accessorFn: (row) => row.tipoEmbalajeId,
        header: 'Tipo de empaque',
        id: 'tipoEmbalajeId',
      },
    ],
    [],
  );

  return columns;
};

