import { ExportConfig, ExportToExcel } from '@/utilities';
import { Outlet, useNavigate } from 'react-router-dom';

import type { Driver } from '../models/driver-model';
import { MaterialReactTable } from 'material-react-table';
import { useBaseTable } from '@/hooks';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useDriversColumns } from '../hooks/useDriversColumns';

const DriverAvailabilityPage = () => {
  const navigate = useNavigate();

  const {
    driversQuery: { data: drivers, isFetching, isLoading, refetch },
  } = useDriverQueries();

  const { columns } = useDriversColumns();

  const table = useBaseTable<Driver>({
    columns,
    data: drivers || [],
    tableId: 'availability-drivers-table',
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

export default DriverAvailabilityPage;

const exportConf: ExportConfig<Driver> = {
  fileName: 'Operadores',
  withDate: true,
  sheetName: 'Operadores',
  columns: [
    { accessorFn: (data) => data.name, header: 'OPERADOR' },
    { accessorFn: (data) => data.company?.name, header: 'EMPRESA' },
    { accessorFn: (data) => data.job.name, header: 'TIPO' },
    { accessorFn: (data) => data.vehicle?.name, header: 'UNIDAD' },
    { accessorFn: (data) => data.licenseId, header: 'LICENCIA' },
    { accessorFn: (data) => data.licenseType, header: 'TIPO LICENCIA' },
    { accessorFn: (data) => data.modality, header: 'MODALIDAD' },
    {
      accessorFn: (data) => (data.isDangerous ? 'SI' : 'NO'),
      header: 'PELIGROSO',
    },
    { accessorFn: (data) => data.status, header: 'ESTADO' },
    { accessorFn: (data) => data.travel?.name, header: 'VIAJE' },
    { accessorFn: (data) => data.maneuver?.type, header: 'MANIOBRA' },
    { accessorFn: (data) => data.maneuver?.id, header: 'ID MANIOBRA' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

