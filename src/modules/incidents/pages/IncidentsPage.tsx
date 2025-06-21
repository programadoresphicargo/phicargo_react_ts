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
import { DateRangePicker } from '@/components/inputs';
import { useIncidentsContext } from '../hooks/useIncidentsContext';
import EditIcon from '@mui/icons-material/Edit';
import { EditIncidentModal } from '../components/EditIncidentModal';

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
  const { dateRange, setDateRange, formatedDateRange } = useIncidentsContext();

  const [detail, setDetail] = useState<Incident | null>(null);

  const {
    incidentsQuery: { data: incidents, isFetching, isLoading, refetch, error },
  } = useIncidentsQueries({
    startDate: formatedDateRange.startDate,
    endDate: formatedDateRange.endDate,
  });

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
    containerHeight: 'calc(100vh - 170px)',
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
        <Tooltip title="Editar">
          <IconButton size="small" onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    toolbarActions: (
      <div className="flex items-center gap-4">
        <AddButton
          label="Crear Incidencia"
          size="small"
          onClick={() => table.setCreatingRow(true)}
        />
        <DateRangePicker
          showOneCalendar
          placeholder="Rango"
          showWeekNumbers
          isoWeek
          ranges={[]}
          value={dateRange}
          onChange={setDateRange}
          cleanable={false}
        />
      </div>
    ),
    muiEditRowDialogProps: dialogProps,
    muiCreateRowModalProps: dialogProps,
    renderCreateRowDialogContent: ({ table }) => (
      <CreateIncidentModal onClose={() => table.setCreatingRow(null)} />
    ),
    renderEditRowDialogContent: ({ table, row }) => (
      <EditIncidentModal
        onClose={() => table.setEditingRow(null)}
        incident={row.original}
      />
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

