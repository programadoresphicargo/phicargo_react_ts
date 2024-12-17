import DriversWithRealStatus from '../utilities/get-drivers-real-status';
import { MaterialReactTable } from 'material-react-table';
import { useBaseTable } from '../../core/hooks/useBaseTable';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useDriversSummaryColumns } from '../hooks/useDriversSummaryColumns';
import { useMemo } from 'react';
import { useTableState } from '../../core/hooks/useTableState';

const DriverSummaryPage = () => {
  const {
    driversQuery: { data: drivers, isFetching, refetch },
  } = useDriverQueries();

  const state = useTableState({
    tableId: 'availability-summary-drivers-table',
  });

  const { columns } = useDriversSummaryColumns();

  const driversWithStatus = useMemo(() => {
    const vehiclesTransformr = new DriversWithRealStatus(drivers || []);
    return vehiclesTransformr.getVehiclesWithRealStatus();
  }, [drivers]);

  const table = useBaseTable({
    columns,
    data: driversWithStatus || [],
    state,
    isLoading: isFetching,
    refetch,
    memoMode: 'cells',
  });

  return <MaterialReactTable table={table} />;
};

export default DriverSummaryPage;

