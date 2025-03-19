import { ExportConfig, ExportToExcel } from '@/utilities';

import { MaterialReactTable } from 'material-react-table';
import type { VehicleWithRealStatus } from '../models/vehicle-model';
import VehiclesWithRealStatus from '../utilities/get-vehicles-real-status';
import { useBaseTable } from '@/hooks';
import { useMemo } from 'react';
import { useSummaryColumns } from '../hooks/useSummaryColumns';
import { useVehicleQueries } from '../hooks/useVehicleQueries';

const SummaryPage = () => {
  const {
    vehicleQuery: { data: vehicles, isFetching, isLoading, refetch },
  } = useVehicleQueries();

  const { columns } = useSummaryColumns();

  const vehiclesWithStatus = useMemo(() => {
    const vehiclesTransformr = new VehiclesWithRealStatus(vehicles || []);
    return vehiclesTransformr.getVehiclesWithRealStatus();
  }, [vehicles]);

  const table = useBaseTable<VehicleWithRealStatus>({
    columns,
    data: vehiclesWithStatus || [],
    tableId: 'availability-summary-vehicles-table',
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

export default SummaryPage;

const exportConf: ExportConfig<VehicleWithRealStatus> = {
  fileName: 'Resumen Unidades',
  withDate: true,
  sheetName: 'Resument Unidades',
  columns: [
    { accessorFn: (data) => data.name, header: 'UNIDAD' },
    { accessorFn: (data) => data.company?.name, header: 'EMPRESA' },
    { accessorFn: (data) => data.realStatus, header: 'ESTATUS REAL' },
    { accessorFn: (data) => data.travel?.name, header: 'VIAJE' },
    { accessorFn: (data) => data.maneuver?.type, header: 'MANIOBRA' },
    { accessorFn: (data) => data.maneuver?.id, header: 'ID MANIOBRA' },
    {
      accessorFn: (data) => data.maintenanceRecord?.orderService,
      header: 'ORDEN DE SERVICIO',
    },
  ],
};

const toExcel = new ExportToExcel(exportConf);

