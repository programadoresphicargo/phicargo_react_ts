import {
  Box,
  DialogProps,
  IconButton,
  Tooltip,
} from '@mui/material';

import { AddButton } from '@/components/ui';
import type { Complaint } from '../models';
import { CreateComplaintForm } from '../components/complaint-creation/CreateComplaintForm';
import { EditComplaint } from '../components/complaint-edition/EditComplaint';
import EditIcon from '@mui/icons-material/Edit';
import { MaterialReactTable } from 'material-react-table';
import { MuiTransition } from '@/components';
import UpdateIcon from '@mui/icons-material/Update';
import { useBaseTable } from '@/hooks';
import { useComplaintsColumns } from '../hooks';
import { useGetComplaintsQuery } from '../hooks/queries';
import { useState } from 'react';
import { UpdateComplaintStatus } from '../components/complaint-edition/UpdateComplaintStatus';

const dialogProps: DialogProps = {
  slots: {
    transition: MuiTransition,
  },
  maxWidth: 'xl',
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
  const [itemToUpdate, setItemToUpdate] = useState<Complaint | null>(null);

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
    onDoubleClickFn: (row) => {
      table.setEditingRow(row);
    },
    renderRowActions: ({ row, table }) => (
      <Box>
        <Tooltip title="Editar">
          <IconButton size="small" onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Actualizar status">
          <IconButton
            size="small"
            color="primary"
            onClick={() => setItemToUpdate(row.original)}
          >
            <UpdateIcon />
          </IconButton>
        </Tooltip>
      </Box>
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

      <UpdateComplaintStatus
        complaint={itemToUpdate}
        onClose={() => setItemToUpdate(null)}
      />
    </>
  );
};

export default ComplaintsPage;

