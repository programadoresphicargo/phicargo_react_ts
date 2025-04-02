import { Chip } from '@heroui/react';
import type { MRT_ColumnDef } from 'material-react-table';
import type { Waybill } from '../models';
import { getWaybillStatusConfig } from '../utilities';
import { useMemo } from 'react';

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
          const statusConf = getWaybillStatusConfig(row.original.state);
          return statusConf ? (
            <Chip color={statusConf.color || 'default'} size="sm">
              {statusConf.status}
            </Chip>
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

