import { MaterialReactTable } from 'material-react-table';
import { useIncidentsQueries } from '../hooks/quries';
import { useIncidentsColumns } from '../hooks/useIncidentsColumns';
import { useBaseTable } from '@/hooks';
import type { Incident } from '../models';

const IncidentsPage = () => {
  const {
    incidentsQuery: { data: incidents, isFetching, isLoading, refetch, error },
  } = useIncidentsQueries();

  const columns = useIncidentsColumns();

  const table = useBaseTable<Incident>({
    columns,
    data: incidents || [],
    tableId: 'incidents-table',
    isLoading: isLoading,
    isFetching: isFetching,
    error: error?.message,
    refetchFn: () => refetch(),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 210px)',
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default IncidentsPage;

