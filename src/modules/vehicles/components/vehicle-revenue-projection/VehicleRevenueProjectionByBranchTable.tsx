import { ExportConfig, ExportToExcel } from '@/utilities';

import { MaterialReactTable } from 'material-react-table';
import type { VehicleRevenueProjectionByBranch } from '../../models';
import { useBaseTable } from '@/hooks';
import { useGetVehicleRevenueProjectionQuery } from '../../hooks/queries';
import { useVehicleRevenueProjectionByBranchColumns } from '../../hooks/useVehicleRevenueProjectionByBranchColumns';
import { useVehicleRevenueProjectionContext } from '../../hooks';

export const VehicleRevenueProjectionByBranchTable = () => {
  const { snapshotDate } = useVehicleRevenueProjectionContext();

  const columns = useVehicleRevenueProjectionByBranchColumns();
  const {
    getVehicleRevenueProjectionByBranchQuery,
    getVehicleRevenueProjectionByBranchSnapshotQuery,
  } = useGetVehicleRevenueProjectionQuery();

  const query = snapshotDate
    ? getVehicleRevenueProjectionByBranchSnapshotQuery
    : getVehicleRevenueProjectionByBranchQuery;

  const table = useBaseTable<VehicleRevenueProjectionByBranch>({
    columns,
    data: query.data || [],
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    refetchFn: query.refetch,
    exportFn: (data) => toExcel.exportData(data),
    tableId: 'vehicle-revenue-projection-by-branch-table',
    containerHeight: 'calc(100vh - 280px)',
    enableRowActions: false,
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

const exportConf: ExportConfig<VehicleRevenueProjectionByBranch> = {
  fileName: 'Proyección de Ingresos por Sucursal',
  withDate: true,
  sheetName: 'Proyección Ingresos sucursal',
  columns: [
    { accessorFn: (data) => data.branch, header: 'SUCURSAL' },
    { accessorFn: (data) => data.monthlyTarget, header: 'OBJETIVO MENSUAL' },
    { accessorFn: (data) => data.dailyTarget, header: 'OBJETIVO DIARIO' },
    {
      accessorFn: (data) => data.totalWorkingDays,
      header: 'DÍAS DE OPERACIÓN',
    },
    {
      accessorFn: (data) => data.idealMonthlyRevenue,
      header: 'INGRESO MENSUAL IDEAL',
    },
    {
      accessorFn: (data) => data.realMonthlyRevenue,
      header: 'INGRESO MENSUAL REAL',
    },
    {
      accessorFn: (data) => data.realMonthlyRevenueLocal,
      header: 'INGRESO MENSUAL LOCAL REAL',
    },
    {
      accessorFn: (data) => data.extraCosts,
      header: 'COSTOS EXTRA',
    },
      
  ],
};

const toExcel = new ExportToExcel(exportConf);

