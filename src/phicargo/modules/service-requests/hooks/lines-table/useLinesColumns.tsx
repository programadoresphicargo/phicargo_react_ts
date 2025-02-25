import type { MRT_ColumnDef } from 'material-react-table';
import type { ServiceCreate } from '../../models';
import { useGetTransportableProducts } from '../queries';
import { useMemo } from 'react';

export const useLinesColumns = () => {
  const { selection } = useGetTransportableProducts();

  const columns = useMemo<MRT_ColumnDef<ServiceCreate>[]>(
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
        accessorFn: (row) => row.estamatedWeight,
        header: 'Peso Estimado',
        id: 'estamatedWeight',
        Cell: ({ row }) => `${row.original.estamatedWeight} TON`,
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

