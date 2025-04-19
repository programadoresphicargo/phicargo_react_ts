import { AddButton } from '@/components/ui';
import type { Complaint } from '../models';
import { MaterialReactTable } from 'material-react-table';
import { useBaseTable } from '@/hooks';
import { useComplaintsColumns } from '../hooks';
import { useGetComplaintsQuery } from '../hooks/queries';

const ComplaintsPage = () => {
  const {
    getComplaintsQuery: { data, isLoading, isFetching, refetch },
  } = useGetComplaintsQuery();

  const columns = useComplaintsColumns();

  const table = useBaseTable<Complaint>({
    columns,
    data: data || [],
    isFetching,
    isLoading,
    refetchFn: refetch,
    tableId: 'complaints-table',
    containerHeight: 'calc(100vh - 220px)',
    enableRowActions: true,
    columnFilterDisplayMode: 'popover',
    positionActionsColumn: 'first',
    toolbarActions: (
      <AddButton
        label="Crear Queja"
        size="small"
        onClick={() => table.setCreatingRow(true)}
      />
    ),
    // muiEditRowDialogProps: dialogProps,
    // muiCreateRowModalProps: dialogProps,
    // renderEditRowDialogContent: ({ table, row }) => (
    //   <EditRecordForm
    //     onClose={() => table.setEditingRow(null)}
    //     record={row.original}
    //   />
    // ),
    // renderCreateRowDialogContent: ({ table }) => (
    //   <CreateRecordForm onClose={() => table.setCreatingRow(null)} />
    // ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default ComplaintsPage;

