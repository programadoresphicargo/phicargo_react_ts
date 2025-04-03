import { ExportConfig, ExportToExcel } from '@/utilities';

import { MaterialReactTable } from 'material-react-table';
import { Outlet } from 'react-router-dom';
import { Vehicle } from '../../vehicles/models';
import { VehicleInformationModal } from '../../vehicles/components/VehicleInformationModal';
import { useBaseTable } from '@/hooks';
import { useState } from 'react';
import { useVehicleColumns } from '../hooks/useVehicleColumns';
import { useVehicleQueries } from '../../vehicles/hooks/queries';

const AsignacionUnidades = () => {

  const [vehicleInfo, setVehicleInfo] = useState<Vehicle | null>(null);

  const { columns } = useVehicleColumns();

  const {
    vehicleQuery: { data: vehicles, isFetching, isLoading, refetch },
  } = useVehicleQueries();

  const onOpenInfo = (vehicle: Vehicle) => {
    setVehicleInfo(vehicle);
  };

  const table = useBaseTable<Vehicle>({
    columns,
    data: vehicles || [],
    tableId: 'availability-vehicles-table',
    isLoading,
    isFetching,
    onDoubleClickFn: onOpenInfo,
    refetchFn: () => refetch(),
    exportFn: (data) => toExcel.exportData(data),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 165px)',
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {vehicleInfo && (
        <VehicleInformationModal
          open={!!vehicleInfo}
          onClose={() => setVehicleInfo(null)}
          vehicle={vehicleInfo}
        />
      )}
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

