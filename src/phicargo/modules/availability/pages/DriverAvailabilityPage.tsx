import { Outlet, useNavigate } from 'react-router-dom';

import MaterialTableBase from '../../core/components/tables/MaterialTableBase';
import { useBaseTable } from '../../core/hooks/useBaseTable';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useDriversColumns } from '../hooks/useDriversColumns';
import { useTableState } from '../../core/hooks/useTableState';
import type { Driver } from '../models/driver-model';
import {
  ExportToExcel,
  type ExportConfig,
} from '../../core/utilities/export-to-excel';

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

const DriverAvailabilityPage = () => {
  const navigate = useNavigate();

  const {
    driversQuery: { data: drivers, isFetching, refetch },
  } = useDriverQueries();

  const state = useTableState({
    tableId: 'availability-drivers-table',
  });

  const { columns } = useDriversColumns();

  const table = useBaseTable({
    columns,
    data: drivers || [],
    state,
    isLoading: isFetching,
    refetch,
    onDoubleClickFn: (id) => navigate(`detalles/${id}`),
    memoMode: 'cells',
    onExportExcel: (data) => toExcel.exportData(data),
  });

  return (
    <>
      <MaterialTableBase table={table} />
      <Outlet />
    </>
  );
};

export default DriverAvailabilityPage;

