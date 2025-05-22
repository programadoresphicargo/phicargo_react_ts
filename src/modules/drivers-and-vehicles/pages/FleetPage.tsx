import { exportToCSV } from '@/phicargo/utils/export';
import { MaterialReactTable } from 'material-react-table';
import { useFleetColumns } from '../hooks/useFleetColumns';
import { Fleet } from '@/modules/vehicles/models';
import { useFleetQueries } from '@/modules/vehicles/hooks/queries';
import { useBaseTable } from '@/hooks';

const FleetPage = () => {
  const { getFleetQuery } = useFleetQueries();

  const columns = useFleetColumns();

  const table = useBaseTable<Fleet>({
    columns,
    data: getFleetQuery.data || [],
    tableId: 'availability-fleet-table',
    isLoading: getFleetQuery.isLoading,
    isFetching: getFleetQuery.isFetching,
    refetchFn: () => getFleetQuery.refetch(),
    exportFn: (data) => exportToCSV(data || [], columns, 'unidades.csv'),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 165px)',
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default FleetPage;

