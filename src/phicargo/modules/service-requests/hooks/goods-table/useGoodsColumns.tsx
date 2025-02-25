import type { Good } from '../../models';
import type { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';

export const useGoodsColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Good>[]>(
    () => [
      {
        accessorFn: (row) => row.description,
        header: 'Descripción',
        id: 'description',
      },
      {
        accessorFn: (row) => row.dimensions,
        header: 'Dimensiones',
        id: 'dimensions',
      },
      {
        accessorFn: (row) => row.goodSatId,
        header: 'Producto SAT',
        id: 'goodSatId',
      },
      {
        accessorFn: (row) => row.quantity,
        header: 'Cantidad',
        id: 'quantity',
      },
      {
        accessorFn: (row) => row.udmSatId,
        header: 'UDM SAT',
        id: 'udmSatId',
      },
      {
        accessorFn: (row) => row.weight,
        header: 'Peso',
        id: 'weight',
      },
      {
        accessorFn: (row) => row.isDangerous,
        header: 'Es peligroso',
        id: 'isDangerous',
      },
      {
        accessorFn: (row) => row.hazardousMaterialKey,
        header: 'Clave de material peligroso',
        id: 'hazardousMaterialKey',
      },
      {
        accessorFn: (row) => row.packagingTypeId,
        header: 'Tipo de empaque',
        id: 'packagingTypeId',
      },
    ],
    [],
  );

  return columns;
};

