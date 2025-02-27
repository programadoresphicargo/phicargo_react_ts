import type { MRT_ColumnDef } from 'material-react-table';
import type { ShippedProductCreate } from '../../models';
import { useGetTransportableProducts } from '../queries';
import { useMemo } from 'react';

export const useLinesColumns = () => {
  const { selection } = useGetTransportableProducts();

  const columns = useMemo<MRT_ColumnDef<ShippedProductCreate>[]>(
    () => [
      {
        accessorFn: (row) => row.productId,
        header: 'Servicio / Producto',
        id: 'serviceId',
        Cell: ({ row }) => {
          const product = selection.find(
            (p) => p.id === row.original.productId,
          );
          return product?.label || '';
        },
      },
      {
        accessorFn: (row) => row.weightEstimation,
        header: 'Peso Estimado',
        id: 'estamatedWeight',
        Cell: ({ row }) => `${row.original.weightEstimation} TON`,
      },
      {
        accessorFn: (row) => row.productUomQtyEst,
        header: 'Cantidad Estimada',
        id: 'estamatedQuantity',
      },
      {
        accessorFn: (row) => row.notes,
        header: 'Notas',
        id: 'notes',
      },
    ],
    [selection],
  );

  return columns;
};

