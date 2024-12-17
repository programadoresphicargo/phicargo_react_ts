import { Outlet, useNavigate } from 'react-router-dom';

import {
  MaterialReactTable,
} from 'material-react-table';
import { useBaseTable } from '../../core/hooks/useBaseTable';
import { useTableState } from '../../core/hooks/useTableState';
import { useVehicleColumns } from '../hooks/useVehicleColumns';
import { useVehicleQueries } from '../hooks/useVehicleQueries';

const AsignacionUnidades = () => {
  const navigate = useNavigate();

  const state = useTableState({
    tableId: 'availability-vehicles-table',
  });

  const { columns } = useVehicleColumns();

  const {
    vehicleQuery: { data: vehicles, isFetching, refetch },
  } = useVehicleQueries();

  const table = useBaseTable({
    columns,
    data: vehicles || [],
    state,
    isLoading: isFetching,
    refetch,
    onDoubleClickFn: (id) => navigate(`detalles/${id}`),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Outlet />
    </>
  );
};

export default AsignacionUnidades;
