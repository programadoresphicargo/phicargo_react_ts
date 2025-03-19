import DriversWithRealStatus from '../utilities/get-drivers-real-status';
import { MaterialReactTable } from 'material-react-table';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useDriversSummaryColumns } from '../hooks/useDriversSummaryColumns';
import { useMemo } from 'react';
import type { DriverWithRealStatus } from '../models/driver-model';
import {
  type ExportConfig,
  ExportToExcel,
} from '../../core/utilities/export-to-excel';
import { useBaseTable } from '@/hooks';

const DriverSummaryPage = () => {
  const {
    driversQuery: { data: drivers, isFetching, isLoading, refetch },
  } = useDriverQueries();

  const { columns } = useDriversSummaryColumns();

  const driversWithStatus = useMemo(() => {
    const vehiclesTransformr = new DriversWithRealStatus(drivers || []);
    return vehiclesTransformr.getVehiclesWithRealStatus();
  }, [drivers]);

  const table = useBaseTable<DriverWithRealStatus>({
    columns,
    data: driversWithStatus || [],
    tableId: 'availability-drivers-table',
    isLoading,
    isFetching,
    refetchFn: () => refetch(),
    exportFn: (data) => toExcel.exportData(data),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 165px)',
  });

  return <MaterialReactTable table={table} />;
};

export default DriverSummaryPage;

const exportConf: ExportConfig<DriverWithRealStatus> = {
  fileName: 'Resumen Operadores',
  withDate: true,
  sheetName: 'Resumen Operadores',
  columns: [
    { accessorFn: (data) => data.name, header: 'OPERADOR' },
    { accessorFn: (data) => data.job.name, header: 'TIPO' },
    { accessorFn: (data) => data.realStatus, header: 'ESTATUS REAL' },
    { accessorFn: (data) => data.travel?.name, header: 'VIAJE' },
    { accessorFn: (data) => data.maneuver?.type, header: 'MANIOBRA' },
    { accessorFn: (data) => data.maneuver?.id, header: 'ID MANIOBRA' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

