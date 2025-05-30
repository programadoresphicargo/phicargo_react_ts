import { CurrencyCell, CurrencyFooterCell } from '@/components/ui';

import type { MRT_ColumnDef } from 'material-react-table';
import type { VehicleRevenueProjectionByBranch } from '../models';
import { formatPercentage } from '@/utilities';
import { useMemo } from 'react';

export const useVehicleRevenueProjectionByBranchColumns = () => {
  const columns = useMemo<
    MRT_ColumnDef<VehicleRevenueProjectionByBranch>[]
  >(() => {
    return [
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
        accessorKey: 'monthlyTarget',
        header: 'OBJETIVO MENS IDEAL',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
        Footer: ({ column }) => {
          const total = column
            .getFacetedRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.monthlyTarget ?? 0),
              0,
            );
          return <CurrencyFooterCell value={total} />;
        },
      },
      {
        accessorKey: 'dailyTarget',
        header: 'OBJETIVO DIARIO IDEAL',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
        Footer: ({ column }) => {
          const total = column
            .getFacetedRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.dailyTarget ?? 0),
              0,
            );
          return <CurrencyFooterCell value={total} />;
        },
      },
      {
        accessorKey: 'totalWorkingDays',
        header: 'DÍAS OPS',
      },
      {
        accessorKey: 'idealMonthlyRevenue',
        header: 'OBJETIVO MENS',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
        Footer: ({ column }) => {
          const total = column
            .getFacetedRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.idealMonthlyRevenue ?? 0),
              0,
            );
          return <CurrencyFooterCell value={total} />;
        },
      },
      {
        accessorKey: 'realMonthlyRevenue',
        header: 'REAL MENSUAL',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
        Footer: ({ column }) => {
          const total = column
            .getFacetedRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.realMonthlyRevenue ?? 0),
              0,
            );
          return <CurrencyFooterCell value={total} />;
        },
      },
      {
        accessorKey: 'realMonthlyRevenueLocal',
        header: 'REAL MENSUAL LOCAL',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
        Footer: ({ column }) => {
          const total = column
            .getFacetedRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.realMonthlyRevenueLocal ?? 0),
              0,
            );
          return <CurrencyFooterCell value={total} />;
        },
      },
      {
        accessorKey: 'extraCosts',
        header: 'COSTOS EXTRA',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
        Footer: ({ column }) => {
          const total = column
            .getFacetedRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.realMonthlyRevenue ?? 0),
              0,
            );
          return <CurrencyFooterCell value={total} />;
        },
      },
      {
        header: 'TOTAL RECAUDADO',
        Cell: ({ row }) => {
          const realRevenue = row.original.realMonthlyRevenue ?? 0;
          const extraCosts = row.original.extraCosts ?? 0;
          const realRevenueLocal = row.original.realMonthlyRevenueLocal ?? 0;
          return (
            <CurrencyCell value={realRevenue + extraCosts + realRevenueLocal} />
          );
        },
        Footer: ({ column }) => {
          const total = column.getFacetedRowModel().rows.reduce((sum, row) => {
            const realRevenue = row.original.realMonthlyRevenue ?? 0;
            const extraCosts = row.original.extraCosts ?? 0;
            const realRevenueLocal = row.original.realMonthlyRevenueLocal ?? 0;
            return sum + realRevenue + extraCosts + realRevenueLocal;
          }, 0);
          return <CurrencyFooterCell value={total} />;
        },
      },
      {
        header: 'PORCENTAJE',
        Cell: ({ row }) => {
          const idealMonthlyRevenue = row.original.idealMonthlyRevenue ?? 0;
          const revenue =
            (row.original.realMonthlyRevenue ?? 0) +
            (row.original.extraCosts ?? 0) +
            (row.original.realMonthlyRevenueLocal ?? 0);

          return (
            <span className="font-bold uppercase">
              {formatPercentage(revenue / idealMonthlyRevenue, true)}
            </span>
          );
        },
        Footer: ({ column }) => {
          const idealMonthlyRevenue = column
            .getFacetedRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.idealMonthlyRevenue ?? 0),
              0,
            );
          const realMonthlyRevenue = column
            .getFacetedRowModel()
            .rows.reduce(
              (sum, row) =>
                sum +
                ((row.original.realMonthlyRevenue ?? 0) +
                  (row.original.extraCosts ?? 0) +
                  (row.original.realMonthlyRevenueLocal ?? 0)),
              0,
            );

          return (
            <div className="p-1 border-t-2 border-t-gray-300 text-lg text-left font-bold">
              <p className="m-0">
                {formatPercentage(
                  realMonthlyRevenue / idealMonthlyRevenue,
                  true,
                )}
              </p>
            </div>
          );
        },
      },
    ];
  }, []);

  return columns;
};

