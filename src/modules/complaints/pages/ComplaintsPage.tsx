import {
  DialogProps,
} from '@mui/material';
import { AddButton } from '@/components/ui';
import type { Complaint } from '../models';
import { EditComplaint } from '../components/complaint-edition/EditComplaint';
import { MaterialReactTable } from 'material-react-table';
import { MuiTransition } from '@/components';
import { useBaseTable } from '@/hooks';
import { useComplaintsColumns } from '../hooks';
import { useGetComplaintsQuery } from '../hooks/queries';

const dialogProps: DialogProps = {
  slots: {
    transition: MuiTransition,
  },
  fullScreen: true,
  disableEnforceFocus: true,
  disableScrollLock: true,
  open: true,
};

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
    showColumnFilters: true,
    columnFilterDisplayMode: "subheader",
    initialState: {
      showColumnFilters: true,
    },
    toolbarActions: (
      <AddButton
        label="Crear No Conformidad"
        size="small"
        onClick={() => table.setCreatingRow(true)}
      />
    ),
    onDoubleClickFn: (row) => {
      table.setEditingRow(row);
    },
    muiEditRowDialogProps: dialogProps,
    muiCreateRowModalProps: dialogProps,
    renderEditRowDialogContent: ({ table, row }) => (
      <EditComplaint
        onClose={() => table.setEditingRow(null)}
        complaint={row.original}
      />
    ),
    renderCreateRowDialogContent: ({ table }) => (
      <EditComplaint
        onClose={() => table.setCreatingRow(null)}
        complaint={null}
      />
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default ComplaintsPage;

