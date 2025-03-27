import { CurrencyCell } from '@/components/ui';
import type { MRT_ColumnDef } from 'material-react-table';
import type { VehicleRevenueProjectionByBranch } from '../models';
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
        header: 'OBJETIVO MENS',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
      },
      {
        accessorKey: 'dailyTarget',
        header: 'OBJETIVO DIARIO',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
      },
      {
        accessorKey: 'totalWorkingDays',
        header: 'DÍAS OPS',
      },
      {
        accessorKey: 'idealMonthlyRevenue',
        header: 'OBJETIVO MENS IDEAL',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
      },
      {
        accessorKey: 'realMonthlyRevenue',
        header: 'REAL MENSUAL',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
      },
    ];
  }, []);

  return columns;
};

