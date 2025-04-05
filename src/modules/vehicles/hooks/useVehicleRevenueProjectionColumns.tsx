import { CurrencyCell, CurrencyFooterCell } from '@/components/ui';

import type { MRT_ColumnDef } from 'material-react-table';
import { ModalityChip } from '../../drivers/components/ui/ModalityChip';
import { OperationalDaysCell } from '../components/vehicle-revenue-projection/OperationalDaysCell';
import { VehicleNameCell } from '../components/ui/VehicleNameCell';
import type { VehicleRevenueProjection } from '../models';
import { useMemo } from 'react';

export const useVehicleRevenueProjectionColumns = () => {
  const columns = useMemo<MRT_ColumnDef<VehicleRevenueProjection>[]>(() => {
    return [
      {
        accessorKey: 'name',
        header: 'UNIDAD',
        size: 4,
        Cell: ({ row }) => (
          <VehicleNameCell
            vehicleId={row.original.id}
            vehicleName={row.original.name}
            chip
          />
        ),
      },
      {
        accessorKey: 'company',
        header: 'EMPRESA',
        Cell: ({ cell }) => {
          return (
            <span className="font-bold uppercase">
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'branch',
        header: 'SUCURSAL',
        size: 4,
        Cell: ({ cell }) => {
          return (
            <span className="font-bold uppercase">
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'driver',
        header: 'OPERADOR',
        Cell: ({ cell }) => {
          const value = cell.getValue<string | null>();
          return !value ? (
            <span className="text-gray-400 text-sm">SIN OPERADOR ASIGNADO</span>
          ) : (
            <span className="font-bold uppercase">
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'vehicleType',
        header: 'TIPO',
        size: 4,
        Cell: ({ cell }) => {
          return (
            <span className="font-bold uppercase">
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'configType',
        header: 'CONF.',
        size: 4,
        Cell: ({ row }) => (
          <ModalityChip
            modality={row.original.configType as typeof row.original.configType}
          />
        ),
      },
      {
        accessorKey: 'status',
        header: 'ESTATUS',
        size: 4,
      },
      {
        accessorKey: 'monthlyTarget',
        header: 'OBJETIVO MENS IDEAL',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
        Footer: ({ column }) => {
          const total = column.getFacetedRowModel().rows.reduce(
            (sum, row) => sum + (row.original.monthlyTarget ?? 0),
            0,
          );
          return <CurrencyFooterCell value={total} />;
        }
      },
      {
        accessorKey: 'idealDailyTarget',
        header: 'OBJETIVO DIARIO IDEAL',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
        Footer: ({ column }) => {
          const total = column.getFacetedRowModel().rows.reduce(
            (sum, row) => sum + (row.original.idealDailyTarget ?? 0),
            0,
          );
          return <CurrencyFooterCell value={total} />;
        }
      },
      {
        accessorKey: 'workingDays',
        header: 'DÍAS OPS',
      },
      {
        accessorKey: 'operationalDays',
        header: 'DÍAS OPS REAL',
        Cell: ({ row }) => (
          <OperationalDaysCell
            value={row.original.operationalDays}
            vehicleId={row.original.id}
          />
        ),
      },
      {
        accessorKey: 'dailyTarget',
        header: 'OBJETIVO MENSUAL',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
        Footer: ({ column }) => {
          const total = column.getFacetedRowModel().rows.reduce(
            (sum, row) => sum + (row.original.dailyTarget ?? 0),
            0,
          );
          return <CurrencyFooterCell value={total} />;
        }
      },
      {
        accessorKey: 'realMonthlyRevenue',
        header: 'INGRESO MENS REAL',
        Cell: ({ row }) => (
          <CurrencyCell
            value={row.original.realMonthlyRevenue}
            isWarning={
              row.original.realMonthlyRevenue < row.original.monthlyTarget
            }
          />
        ),
        Footer: ({ column }) => {
          const total = column.getFacetedRowModel().rows.reduce(
            (sum, row) => sum + (row.original.realMonthlyRevenue ?? 0),
            0,
          );
          return <CurrencyFooterCell value={total} />;
        }
      },
      {
        accessorKey: 'availabilityStatus',
        header: 'DISPONIBILIDAD',
      },
    ];
  }, []);

  return columns;
};

