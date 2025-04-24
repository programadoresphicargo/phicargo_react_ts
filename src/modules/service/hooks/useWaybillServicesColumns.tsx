import { travelStatus, waybillStatus } from '../utilities';

import { BasicTextCell } from '@/components/ui';
import { Chip } from '@mui/material';
import type { MRT_ColumnDef } from 'material-react-table';
import { ManeuversCell } from '../components/ui/ManeuversCell';
import type { WaybillService } from '../models';
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
      {
        accessorKey: 'travel.name',
        header: 'Viaje',
        Cell: ({ cell }) => (
          <BasicTextCell
            value={cell.getValue<string>()}
            className="block font-bold text-sm uppercase text-blue-600"
            fallback="Sin viaje"
          />
        ),
        muiTableBodyCellProps: {
          sx: { backgroundColor: '#e2e8f0', padding: '3px 5px' },
        },
      },
      {
        accessorKey: 'travel.status',
        header: 'Estado Viaje',
        Cell: ({ cell }) => (
          <BasicTextCell
            value={cell.getValue<string>()}
            className="block font-bold text-xs uppercase text-blue-600"
            fallback="Sin estado"
          />
        ),
        muiTableBodyCellProps: {
          sx: { backgroundColor: '#e2e8f0', padding: '3px 5px' },
        },
      },
      {
        accessorKey: 'travel.state',
        header: 'Estado Odoo',
        Cell: ({ row }) => {
          const status = row.original.travel?.state;
          return status ? (
            <Chip
              label={travelStatus.getLabel(status)}
              color={travelStatus.getColor(status)}
              variant="outlined"
              size="small"
            />
          ) : null;
        },
        muiTableBodyCellProps: {
          sx: { backgroundColor: '#e2e8f0', padding: '3px 5px' },
        },
      },
      {
        header: 'Maniobras',
        Cell: ({ row }) => (
          <ManeuversCell
            maneuvers={row.original.maneuvers}
            value={row.original.maneuvers.length}
          />
        ),
        muiTableBodyCellProps: {
          sx: { backgroundColor: '#f4f4f5', padding: '3px 5px' },
        },
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
              className="block font-bold uppercase text-xs text-indigo-600"
              fallback="Sin maniobras"
            />
          );
        },
        muiTableBodyCellProps: {
          sx: { backgroundColor: '#f4f4f5', padding: '3px 5px' },
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

