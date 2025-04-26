import { AddButton } from '@/components/ui';
import type { Complaint } from '../models';
import { CreateComplaintForm } from '../components/CreateComplaintForm';
import { DialogProps } from '@mui/material';
import { EditComplaint } from '../components/EditComplaint';
import { MaterialReactTable } from 'material-react-table';
import { MuiTransition } from '@/components';
import { useBaseTable } from '@/hooks';
import { useComplaintsColumns } from '../hooks';
import { useGetComplaintsQuery } from '../hooks/queries';

const dialogProps: DialogProps = {
  slots: {
    transition: MuiTransition,
  },
  maxWidth: 'md',
  disableEnforceFocus: true,
  disableScrollLock: true,
  open: true,
  sx: {
    '& .MuiPaper-root': {
      borderRadius: 4,
    },
  },
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
    enableRowActions: true,
    enableEditing: true,
    columnFilterDisplayMode: 'popover',
    positionActionsColumn: 'first',
    toolbarActions: (
      <AddButton
        label="Crear No Conformidad"
        size="small"
        onClick={() => table.setCreatingRow(true)}
      />
    ),
    muiEditRowDialogProps: dialogProps,
    muiCreateRowModalProps: dialogProps,
    renderEditRowDialogContent: ({ table, row }) => (
      <EditComplaint
        onClose={() => table.setEditingRow(null)}
        complaint={row.original}
      />
    ),
    renderCreateRowDialogContent: ({ table }) => (
      <CreateComplaintForm onClose={() => table.setCreatingRow(null)} />
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default ComplaintsPage;

