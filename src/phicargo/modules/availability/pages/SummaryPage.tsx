import { MaterialReactTable } from 'material-react-table';
import VehiclesWithRealStatus from '../utilities/get-vehicles-real-status';
import { useBaseTable } from '../../core/hooks/useBaseTable';
import { useMemo } from 'react';
import { useSummaryColumns } from '../hooks/useSummaryColumns';
import { useTableState } from '../../core/hooks/useTableState';
import { useVehicleQueries } from '../hooks/useVehicleQueries';
import {
  ExportToExcel,
  type ExportConfig,
} from '../../core/utilities/export-to-excel';
import type { VehicleWithRealStatus } from '../models/vehicle-model';

const SummaryPage = () => {
  const {
    vehicleQuery: { data: vehicles, isFetching, isLoading, refetch },
  } = useVehicleQueries();

  const state = useTableState({
    tableId: 'availability-summary-vehicles-table',
  });

  const { columns } = useSummaryColumns();

  const vehiclesWithStatus = useMemo(() => {
    const vehiclesTransformr = new VehiclesWithRealStatus(vehicles || []);
    return vehiclesTransformr.getVehiclesWithRealStatus();
  }, [vehicles]);

  const table = useBaseTable({
    columns,
    data: vehiclesWithStatus || [],
    state,
    isLoading,
    progressBars: isFetching,
    refetch,
    onExportExcel: (data) => toExcel.exportData(data),
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

