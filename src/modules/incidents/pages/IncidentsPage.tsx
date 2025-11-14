import { MaterialReactTable } from 'material-react-table';
import { useIncidentsQueries } from '../hooks/quries';
import { useIncidentsColumns } from '../hooks/useIncidentsColumns';
import { useBaseTable } from '@/hooks';
import type { Incident } from '../models';
import { CreateIncidentModal } from '../components/CreateIncidentModal';
import { Box, DialogProps } from '@mui/material';
import { MuiTransition } from '@/components';
import InfoIcon from '@mui/icons-material/Info';
import { IncidentDetailsModal } from '../components/IncidentDetailsModal';
import { useState } from 'react';
import { DateRangePicker } from '@/components/inputs';
import { useIncidentsContext } from '../hooks/useIncidentsContext';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Tooltip } from '@heroui/react';

const dialogProps: DialogProps = {
  slots: {
    transition: MuiTransition,
  },
  disableEnforceFocus: true,
  disableScrollLock: true,
  open: true,
  maxWidth: "xl",
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
        <Tooltip content="Detalles">
          <Button
            size="sm"
            radius='full'
            color="primary"
            onPress={() => setDetail(row.original)}
          >
            <InfoIcon />
          </Button>
        </Tooltip>
        <Tooltip content="Editar">
          <Button size="sm" onPress={() => table.setEditingRow(row)} radius='full'>
            <EditIcon />
          </Button>
        </Tooltip>
      </Box>
    ),
    toolbarActions: (
      <div className="flex items-center gap-4">
        <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
          Incidencias
        </h1>
        <Button
          color='primary'
          radius='full'
          onPress={() => table.setCreatingRow(true)}
        >
          Crear incidencia
        </Button>
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
      <CreateIncidentModal label='Crear incidencia' mode="create" onClose={() => table.setCreatingRow(null)} />
    ),
    renderEditRowDialogContent: ({ table, row }) => (
      <CreateIncidentModal label='Editar incidencia' mode="edit" incident={row.original} onClose={() => table.setEditingRow(null)} />
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

