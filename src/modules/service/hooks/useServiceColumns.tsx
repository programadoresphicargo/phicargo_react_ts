import { Chip } from '@mui/material';
import type { MRT_ColumnDef } from 'material-react-table';
import type { Waybill } from '../models';
import { useMemo } from 'react';
import { waybillStatus } from '../utilities';

export const useServiceColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Waybill>[]>(
    () => [
      { accessorKey: 'xReference', header: 'Referencia / Contenedor' },
      { accessorKey: 'name', header: 'Referencia' },
      {
        accessorFn: (row) => row.dateOrder,
        header: 'Fecha',
        id: 'dateOrders',
        filterVariant: 'date',
        Cell: ({ row }) => row.original.dateOrder.format('DD/MM/YYYY'),
      },
      { accessorKey: 'client.name', header: 'Cliente' },
      { accessorKey: 'xSubclienteBel', header: 'Subcliente' },
      { accessorKey: 'xRutaBel', header: 'Ruta Prog' },
      { accessorKey: 'xTipoBel', header: 'Tipo Armado' },
      { accessorKey: 'xModoBel', header: 'Modo' },
      { accessorKey: 'xMedidaBel', header: 'Medida' },
      { accessorKey: 'xClaseBel', header: 'Clase' },
      { accessorKey: 'xCustodiaBel', header: 'Custodia' },
      // { accessorKey: 'xMovBel', header: 'Terminal Retiro' }, TODO: Uncomment when api returns

      {
        accessorKey: 'state',
        header: 'Status',
        Cell: ({ row }) => {
          const status = row.original.state;
          return status ? (
            <Chip
              label={waybillStatus.getLabel(status)}
              color={waybillStatus.getColor(status)}
              size="small"
            />
          ) : null;
        },
      },
      { accessorKey: 'branch.name', header: 'Sucursal' },
      { accessorKey: 'company.name', header: 'Empresa' },
    ],
    [],
  );

  return columns;
};

