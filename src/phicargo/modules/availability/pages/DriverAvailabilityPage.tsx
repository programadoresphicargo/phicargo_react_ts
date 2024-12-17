import { Outlet, useNavigate } from 'react-router-dom';

import MaterialTableBase from '../../core/components/tables/MaterialTableBase';
import { useBaseTable } from '../../core/hooks/useBaseTable';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useDriversColumns } from '../hooks/useDriversColumns';
import { useTableState } from '../../core/hooks/useTableState';

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
  });

  return (
    <>
      <MaterialTableBase table={table} />
      <Outlet />
    </>
  );
};

export default DriverAvailabilityPage;

