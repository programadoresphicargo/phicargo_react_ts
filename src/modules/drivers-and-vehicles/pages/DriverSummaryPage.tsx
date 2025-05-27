import { ExportConfig, ExportToExcel } from '@/utilities';

import { DriverWithRealStatus } from '../../drivers/models';
import DriversWithRealStatus from '../utilities/get-drivers-real-status';
import { MaterialReactTable } from 'material-react-table';
import { useBaseTable } from '@/hooks';
import { useDriverQueries } from '../../drivers/hooks/queries';
import { useDriversSummaryColumns } from '../hooks/useDriversSummaryColumns';
import { useMemo } from 'react';
import { getDriverRealStatusConf } from '../utilities';

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
    { accessorFn: (data) => data.id, header: 'ID DEL OPERADOR' },
    { accessorFn: (data) => data.name, header: 'OPERADOR' },
    { accessorFn: (data) => data.job.name, header: 'TIPO' },
    { accessorFn: (data) => data.realStatus, header: 'ESTATUS REAL' },
    { accessorFn: (data) => getDriverRealStatusConf(data.realStatus).label, header: 'ESTATUS_REAL' },
    { accessorFn: (data) => data.travel?.name, header: 'VIAJE' },
    { accessorFn: (data) => data.maneuver?.type, header: 'MANIOBRA' },
    { accessorFn: (data) => data.maneuver?.id, header: 'ID MANIOBRA' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

