import { MaterialReactTable } from 'material-react-table';
import { useIncidentsQueries } from '../hooks/quries';
import { useIncidentsColumns } from '../hooks/useIncidentsColumns';
import { useBaseTable } from '@/hooks';
import type { Incident } from '../models';
import { CreateIncidentModal } from '../components/CreateIncidentModal';
import { Box, DialogProps, IconButton, Tooltip } from '@mui/material';
import { MuiTransition } from '@/components';
import InfoIcon from '@mui/icons-material/Info';
import { AddButton } from '@/components/ui';
import { IncidentDetailsModal } from '../components/IncidentDetailsModal';
import { useState } from 'react';

const dialogProps: DialogProps = {
  slots: {
    transition: MuiTransition,
  },
  disableEnforceFocus: true,
  disableScrollLock: true,
  open: true,
  maxWidth: 'md',
  sx: {
    '& .MuiPaper-root': {
      borderRadius: 4,
    },
  },
};

const IncidentsPage = () => {
  const [detail, setDetail] = useState<Incident | null>(null);

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
    enableRowActions: true,
    positionActionsColumn: 'first',
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex' }}>
        <Tooltip title="Detalles">
          <IconButton
            size="small"
            color="primary"
            onClick={() => setDetail(row.original)}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    toolbarActions: (
      <AddButton
        label="Añadir Servicio"
        size="small"
        onClick={() => table.setCreatingRow(true)}
      />
    ),
    muiCreateRowModalProps: dialogProps,
    renderCreateRowDialogContent: ({ table }) => (
      <CreateIncidentModal onClose={() => table.setCreatingRow(null)} />
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {detail && (
        <IncidentDetailsModal
          open={!!detail}
          onClose={() => setDetail(null)}
          incident={detail}
        />
      )}
    </>
  );
};

export default IncidentsPage;

