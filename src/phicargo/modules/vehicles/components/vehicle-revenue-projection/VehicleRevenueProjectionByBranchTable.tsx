import { ExportConfig, ExportToExcel } from '@/utilities';

import { MaterialReactTable } from 'material-react-table';
import { VehicleRevenueProjectionByBranch } from '../../models';
import { useBaseTable } from '@/hooks';
import { useGetVehicleRevenueProjectionQuery } from '../../hooks/queries';
import { useVehicleRevenueProjectionByBranchColumns } from '../../hooks/useVehicleRevenueProjectionByBranchColumns';

export const VehicleRevenueProjectionByBranchTable = () => {
  const columns = useVehicleRevenueProjectionByBranchColumns();
  const { getVehicleRevenueProjectionByBranchQuery } =
    useGetVehicleRevenueProjectionQuery();

  const table = useBaseTable<VehicleRevenueProjectionByBranch>({
    columns,
    data: getVehicleRevenueProjectionByBranchQuery.data || [],
    isFetching: getVehicleRevenueProjectionByBranchQuery.isFetching,
    isLoading: getVehicleRevenueProjectionByBranchQuery.isLoading,
    refetchFn: getVehicleRevenueProjectionByBranchQuery.refetch,
    exportFn: () =>
      toExcel.exportData(getVehicleRevenueProjectionByBranchQuery.data || []),
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
  ],
};

const toExcel = new ExportToExcel(exportConf);

