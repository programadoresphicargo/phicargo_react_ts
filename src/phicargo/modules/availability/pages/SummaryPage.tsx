import { MaterialReactTable } from 'material-react-table';
import VehiclesWithRealStatus from '../utilities/get-vehicles-real-status';
import { useBaseTable } from '../../core/hooks/useBaseTable';
import { useMemo } from 'react';
import { useSummaryColumns } from '../hooks/useSummaryColumns';
import { useTableState } from '../../core/hooks/useTableState';
import { useVehicleQueries } from '../hooks/useVehicleQueries';

const SummaryPage = () => {
  const {
    vehicleQuery: { data: vehicles, isFetching, refetch },
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
    isLoading: isFetching,
    refetch,
  });

  return <MaterialReactTable table={table} />;
};

export default SummaryPage;

