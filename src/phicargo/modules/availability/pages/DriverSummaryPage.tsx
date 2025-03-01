import DriversWithRealStatus from '../utilities/get-drivers-real-status';
import { MaterialReactTable } from 'material-react-table';
import { useBaseTable } from '../../core/hooks/useBaseTable';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useDriversSummaryColumns } from '../hooks/useDriversSummaryColumns';
import { useMemo } from 'react';
import { useTableState } from '../../core/hooks/useTableState';
import type { DriverWithRealStatus } from '../models/driver-model';
import {
  type ExportConfig,
  ExportToExcel,
} from '../../core/utilities/export-to-excel';

const DriverSummaryPage = () => {
  const {
    driversQuery: { data: drivers, isFetching, isLoading, refetch },
  } = useDriverQueries();

  const state = useTableState({
    tableId: 'availability-summary-drivers-table',
  });

  const { columns } = useDriversSummaryColumns();

  const driversWithStatus = useMemo(() => {
    const vehiclesTransformr = new DriversWithRealStatus(drivers || []);
    return vehiclesTransformr.getVehiclesWithRealStatus();
  }, [drivers]);

  const table = useBaseTable({
    columns,
    data: driversWithStatus || [],
    state,
    isLoading,
    progressBars: isFetching,
    refetch,
    memoMode: 'cells',
    onExportExcel: (data) => toExcel.exportData(data),
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
