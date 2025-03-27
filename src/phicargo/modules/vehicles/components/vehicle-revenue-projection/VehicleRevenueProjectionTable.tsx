import { MaterialReactTable } from 'material-react-table';
import { VehicleRevenueProjection } from '../../models';
import { useBaseTable } from '@/hooks';
import { useGetVehicleRevenueProjectionQuery } from '../../hooks/queries';
import { useVehicleRevenueProjectionColumns } from '../../hooks/useVehicleRevenueProjectionColumns';

export const VehicleRevenueProjectionTable = () => {
  const columns = useVehicleRevenueProjectionColumns();
  const { getVehicleRevenueProjectionQuery } =
    useGetVehicleRevenueProjectionQuery();

  const table = useBaseTable<VehicleRevenueProjection>({
    columns,
    data: getVehicleRevenueProjectionQuery.data || [],
    isFetching: getVehicleRevenueProjectionQuery.isFetching,
    isLoading: getVehicleRevenueProjectionQuery.isLoading,
    refetchFn: getVehicleRevenueProjectionQuery.refetch,
    tableId: 'vehicle-revenue-projection-table',
    containerHeight: 'calc(100vh - 220px)',
    enableRowActions: false,
    columnFilterDisplayMode: 'popover',
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

