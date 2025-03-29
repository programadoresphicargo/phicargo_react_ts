import { ExportConfig, ExportToExcel } from '@/utilities';

import { MaterialReactTable } from 'material-react-table';
import { VehicleRevenueProjection } from '../../models';
import { useBaseTable } from '@/hooks';
import { useGetVehicleRevenueProjectionQuery } from '../../hooks/queries';
import { useVehicleRevenueProjectionColumns } from '../../hooks/useVehicleRevenueProjectionColumns';
import { useVehicleRevenueProjectionContext } from '../../hooks';

export const VehicleRevenueProjectionTable = () => {
  const { snapshotDate } = useVehicleRevenueProjectionContext();

  const columns = useVehicleRevenueProjectionColumns();

  const {
    getVehicleRevenueProjectionQuery,
    getVehicleRevenueProjectionSnapshotQuery,
  } = useGetVehicleRevenueProjectionQuery();

  const query = snapshotDate
    ? getVehicleRevenueProjectionSnapshotQuery
    : getVehicleRevenueProjectionQuery;

  const table = useBaseTable<VehicleRevenueProjection>({
    columns,
    data: query.data || [],
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    refetchFn: query.refetch,
    exportFn: (data) => toExcel.exportData(data),
    tableId: 'vehicle-revenue-projection-table',
    containerHeight: 'calc(100vh - 220px)',
    enableRowActions: false,
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

const exportConf: ExportConfig<VehicleRevenueProjection> = {
  fileName: 'Proyección de Ingresos',
  withDate: true,
  sheetName: 'Proyección de Ingresos',
  columns: [
    { accessorFn: (data) => data.name, header: 'Unidad' },
    { accessorFn: (data) => data.company, header: 'EMPRESA' },
    { accessorFn: (data) => data.branch, header: 'SUCURSAL' },
    { accessorFn: (data) => data.driver, header: 'OPERADOR' },
    { accessorFn: (data) => data.vehicleType, header: 'TIPO' },
    { accessorFn: (data) => data.configType, header: 'CONF.' },
    { accessorFn: (data) => data.status, header: 'ESTADO' },
    { accessorFn: (data) => data.monthlyTarget, header: 'OBJETIVO MENSUAL' },
    {
      accessorFn: (data) => data.idealDailyTarget,
      header: 'OBJETIVO DIARIO IDEAL',
    },
    { accessorFn: (data) => data.workingDays, header: 'DIAS OPERATIVOS' },
    {
      accessorFn: (data) => data.operationalDays,
      header: 'DIAS OPERATIVOS REALES',
    },
    { accessorFn: (data) => data.dailyTarget, header: 'OBJETIVO DIARIO' },
    {
      accessorFn: (data) => data.realMonthlyRevenue,
      header: 'INGRESO MENSUAL REAL',
    },
    {
      accessorFn: (data) => data.availabilityStatus,
      header: 'ESTATUS DE DISPONIBILIDAD',
    },
  ],
};

const toExcel = new ExportToExcel(exportConf);

