import { Chip } from '@heroui/react';
import type { MRT_ColumnDef } from 'material-react-table';
import type { WaybillService } from '../models';
import { getWaybillStatusConfig } from '../utilities';
import { useMemo } from 'react';

export const useWaybillServicesColumns = () => {
  const columns = useMemo<MRT_ColumnDef<WaybillService>[]>(
    () => [
      { accessorKey: 'reference', header: 'Referencia / Contenedor' },
      { accessorKey: 'name', header: 'Referencia' },
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
      {
        accessorKey: 'travel.name',
        header: 'Viaje',
      },
      {
        accessorKey: 'travel.status',
        header: 'Estado Viaje',
      },
      {
        header: 'Maniobras',
        Cell: ({ row }) => <span>{row.original.maneuvers.length}</span>,
      },  
      {
        header: 'Ultima Maniobra',
        Cell: ({ row }) => {
          const maneuvers = row.original.maneuvers;
          if (maneuvers.length > 0) {
            const lastManeuver = maneuvers[maneuvers.length - 1];
            return (
              <span>
                {lastManeuver.type} - {lastManeuver.status}
              </span>
            );
          }
          return <span>Sin maniobras</span>;
        },
      },  
      {
        accessorFn: (row) => row.dateOrder,
        header: 'Fecha',
        id: 'dateOrders',
        filterVariant: 'date',
        Cell: ({ row }) => row.original.dateOrder.format('DD/MM/YYYY'),
      },
      { accessorKey: 'client.name', header: 'Cliente' },
      { accessorKey: 'subclientBel', header: 'Subcliente' },
      { accessorKey: 'routeBel', header: 'Ruta Prog' },
      { accessorKey: 'typeBel', header: 'Tipo Armado' },
      { accessorKey: 'modeBel', header: 'Modo' },
      { accessorKey: 'measureBel', header: 'Medida' },
      { accessorKey: 'classBel', header: 'Clase' },
      { accessorKey: 'custodyBel', header: 'Custodia' },
      // { accessorKey: 'xMovBel', header: 'Terminal Retiro' }, TODO: Uncomment when api returns

      { accessorKey: 'branch.name', header: 'Sucursal' },
      { accessorKey: 'company.name', header: 'Empresa' },
    ],
    [],
  );

  return columns;
};

