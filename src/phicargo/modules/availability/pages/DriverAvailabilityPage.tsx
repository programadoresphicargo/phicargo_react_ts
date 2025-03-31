import { ExportConfig, ExportToExcel } from '@/utilities';

import type { Driver } from '../../drivers/models';
import { DriverInformationModal } from '../../drivers/components/DriverInformationModal';
import { MaterialReactTable } from 'material-react-table';
import { Outlet } from 'react-router-dom';
import { useBaseTable } from '@/hooks';
import { useDriverQueries } from '../../drivers/hooks/queries';
import { useDriversColumns } from '../hooks/useDriversColumns';
import { useState } from 'react';

const DriverAvailabilityPage = () => {
  const [driverInfo, setDriverInfo] = useState<Driver | null>(null);

  const { driversQuery } = useDriverQueries();

  const { columns } = useDriversColumns();

  const onOpenInfo = (driver: Driver) => {
    setDriverInfo(driver);
  };

  const table = useBaseTable<Driver>({
    columns,
    data: driversQuery.data || [],
    tableId: 'availability-drivers-table',
    isLoading: driversQuery.isLoading,
    isFetching: driversQuery.isFetching,
    error: driversQuery.error?.message,
    onDoubleClickFn: onOpenInfo,
    refetchFn: () => driversQuery.refetch(),
    exportFn: (data) => toExcel.exportData(data),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 165px)',
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {driverInfo && (
        <DriverInformationModal
          open={!!driverInfo}
          onClose={() => setDriverInfo(null)}
          driver={driverInfo}
        />
      )}
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

