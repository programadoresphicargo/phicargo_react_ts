import {
  DialogProps,
} from '@mui/material';
import type { ComplaintAction } from '../models';
import { EditComplaint } from '../components/complaint-edition/EditComplaint';
import { MaterialReactTable } from 'material-react-table';
import { MuiTransition } from '@/components';
import { useBaseTable } from '@/hooks';
import { useGetAllComplaintActionsQuery } from '../hooks/queries/useGetComplaintActionsQuery copy';
import { useComplaintsActionsColumns } from '../hooks/useComplaintsActionsColumns';

const dialogProps: DialogProps = {
  slots: {
    transition: MuiTransition,
  },
  fullScreen: true,
  disableEnforceFocus: true,
  disableScrollLock: true,
  open: true,
};

const ActionsPage = () => {

  const {
    getAllComplaintActionsQuery: { data: actions, isLoading, isFetching, refetch },
  } = useGetAllComplaintActionsQuery();

  const columns = useComplaintsActionsColumns();

  const table = useBaseTable<ComplaintAction>({
    columns,
    data: actions || [],
    isFetching,
    isLoading,
    refetchFn: refetch,
    tableId: 'complaints-table',
    containerHeight: 'calc(100vh - 180px)',
    showColumnFilters: true,
    columnFilterDisplayMode: "subheader",
    initialState: {
      showColumnFilters: true,
    },
    toolbarActions: (
      <>
        <h1>ACCIONES</h1>
      </>
    ),
    onDoubleClickFn: (row) => {
      table.setEditingRow(row);
    },
    muiEditRowDialogProps: dialogProps,
    muiCreateRowModalProps: dialogProps,
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

export default ActionsPage;

