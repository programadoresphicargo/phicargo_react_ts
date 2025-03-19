import {
  type ExportConfig,
  ExportToExcel,
} from '../../core/utilities/export-to-excel';
import { Outlet, useNavigate } from 'react-router-dom';

import { MaterialReactTable } from 'material-react-table';
import type { Vehicle } from '../models/vehicle-model';
import { useVehicleColumns } from '../hooks/useVehicleColumns';
import { useVehicleQueries } from '../hooks/useVehicleQueries';
import { useBaseTable } from '@/hooks';

const AsignacionUnidades = () => {
  const navigate = useNavigate();

  const { columns } = useVehicleColumns();

  const {
    vehicleQuery: { data: vehicles, isFetching, isLoading, refetch },
  } = useVehicleQueries();

  const table = useBaseTable<Vehicle>({
    columns,
    data: vehicles || [],
    tableId: 'availability-vehicles-table',
    isLoading,
    isFetching,
    onDoubleClickFn: (id) => navigate(`detalles/${id}`),
    refetchFn: () => refetch(),
    exportFn: (data) => toExcel.exportData(data),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 165px)',
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Outlet />
    </>
  );
};

export default AsignacionUnidades;

const exportConf: ExportConfig<Vehicle> = {
  fileName: 'Unidades',
  withDate: true,
  sheetName: 'Unidades',
  columns: [
    { accessorFn: (data) => data.name, header: 'UNIDAD' },
    { accessorFn: (data) => data.company?.name, header: 'EMPRESA' },
    { accessorFn: (data) => data.branch?.name, header: 'SUCURSAL' },
    { accessorFn: (data) => data.driver?.name, header: 'OPERADOR' },
    { accessorFn: (data) => data.vehicleType, header: 'TIPO VEHICULO' },
    { accessorFn: (data) => data.loadType, header: 'TIPO CARGA' },
    { accessorFn: (data) => data.modality, header: 'MODALIDAD' },
    { accessorFn: (data) => data.state?.name, header: 'ESTADO' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

