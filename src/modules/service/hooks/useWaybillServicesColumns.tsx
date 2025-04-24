import { BasicTextCell } from '@/components/ui';
import { Chip } from '@heroui/react';
import type { MRT_ColumnDef } from 'material-react-table';
import { ManeuversCell } from '../components/ui/ManeuversCell';
import type { WaybillService } from '../models';
import { getWaybillStatusConfig } from '../utilities';
import { useMemo } from 'react';

export const useWaybillServicesColumns = () => {
  const columns = useMemo<MRT_ColumnDef<WaybillService>[]>(
    () => [
      {
        accessorKey: 'company.name',
        header: 'Empresa',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'branch.name',
        header: 'Sucursal',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'client.name',
        header: 'Cliente',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'name',
        header: 'Referencia',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
      {
        accessorFn: (row) => row.dateOrder,
        header: 'Fecha',
        id: 'dateOrders',
        filterVariant: 'date',
        Cell: ({ row }) => (
          <BasicTextCell value={row.original.dateOrder.format('DD/MM/YYYY')} />
        ),
      },
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
        Cell: ({ cell }) => (
          <BasicTextCell
            value={cell.getValue<string>()}
            className="block font-bold uppercase text-blue-600"
            fallback="Sin viaje"
          />
        ),
      },
      {
        accessorKey: 'travel.status',
        header: 'Estado Viaje',
        Cell: ({ cell }) => (
          <BasicTextCell
            value={cell.getValue<string>()}
            className="block font-bold uppercase text-blue-600"
            fallback="Sin estado"
          />
        ),
      },
      {
        header: 'Maniobras',
        Cell: ({ row }) => (
          <ManeuversCell
            maneuvers={row.original.maneuvers}
            value={row.original.maneuvers.length}
          />
        ),
      },
      {
        header: 'Ultima Maniobra',
        Cell: ({ row }) => {
          const maneuvers = row.original.maneuvers;
          const value =
            maneuvers.length > 0
              ? `${maneuvers[maneuvers.length - 1].type} - ${
                  maneuvers[maneuvers.length - 1].status
                }`
              : null;
          return (
            <BasicTextCell
              value={value}
              className="block font-bold uppercase text-indigo-600"
              fallback="Sin maniobras"
            />
          );
        },
      },
      {
        accessorKey: 'reference',
        header: 'Referencia / Contenedor',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'typeBel',
        header: 'Tipo Armado',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'modeBel',
        header: 'Modo',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'subclientBel',
        header: 'Subcliente',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'routeBel',
        header: 'Ruta Prog',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'measureBel',
        header: 'Medida',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'classBel',
        header: 'Clase',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'custodyBel',
        header: 'Custodia',
        Cell: ({ cell }) => <BasicTextCell value={cell.getValue<string>()} />,
      },
    ],
    [],
  );

  return columns;
};

