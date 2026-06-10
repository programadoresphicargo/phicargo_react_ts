import {
  DialogProps,
} from '@mui/material';
import type { Complaint } from '../models';
import { EditComplaint } from '../components/complaint-edition/EditComplaint';
import { MaterialReactTable } from 'material-react-table';
import { MuiTransition } from '@/components';
import { useBaseTable } from '@/hooks';
import { useComplaintsColumns } from '../hooks';
import { useGetComplaintsQuery } from '../hooks/queries';
import { Button } from '@heroui/react';
import Header from '../components/ui/Header';

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
    containerHeight: 'calc(100vh - 270px)',
    showColumnFilters: true,
    columnFilterDisplayMode: "subheader",
    initialState: {
      showColumnFilters: true,
    },
    toolbarActions: (
      <Button
        color='primary'
        size="sm"
        onPress={() => table.setCreatingRow(true)}
        radius='full'
      >
        Nuevo
      </Button>
    ),
    onDoubleClickFn: (row) => {
      table.setEditingRow(row);
    },
    muiEditRowDialogProps: dialogProps,
    muiCreateRowModalProps: dialogProps,
    renderEditRowDialogContent: ({ table, row }) => (
      <EditComplaint
        onClose={() => table.setEditingRow(null)}
        id={row.original.id}
      />
    ),
    renderCreateRowDialogContent: ({ table }) => (
      <EditComplaint
        onClose={() => table.setCreatingRow(null)}
        id={null}
      />
    ),
  });

  return (
    <>
      <Header></Header>
      <MaterialReactTable table={table} />
    </>
  );
};

export default ComplaintsPage;

