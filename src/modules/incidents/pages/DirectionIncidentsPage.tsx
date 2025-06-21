import { useBaseTable } from '@/hooks';
import { useIncidentsQueries } from '../hooks/quries';
import { useIncidentsColumns } from '../hooks/useIncidentsColumns';
import { useIncidentsContext } from '../hooks/useIncidentsContext';
import { Incident } from '../models';
import { DateRangePicker } from '@/components/inputs';
import { MaterialReactTable } from 'material-react-table';
import { useMemo, useState } from 'react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import InfoIcon from '@mui/icons-material/Info';
import { Box, IconButton, Tooltip } from '@mui/material';
import { MuiAlertDialog } from '@/components';
import dayjs from 'dayjs';
import { IncidentDetailsModal } from '../components/IncidentDetailsModal';

const DirectionIncidentsPage = () => {
  const { dateRange, setDateRange, formatedDateRange } = useIncidentsContext();
  const [detail, setDetail] = useState<Incident | null>(null);

  const [toAttendIncident, setToAttendIncident] = useState<Incident | null>(
    null,
  );

  const {
    updateIncident: { mutate: updateIncidentMutate },
    incidentsQuery: { data: incidents, isFetching, isLoading, refetch, error },
  } = useIncidentsQueries({
    startDate: formatedDateRange.startDate,
    endDate: formatedDateRange.endDate,
  });

  const directionIncidents = useMemo<Incident[]>(() => {
    return (
      incidents?.filter(
        (incident) => incident.incident === 'REPORTE A DIRECCIÓN',
      ) || []
    );
  }, [incidents]);

  const onAtttendIncident = () => {
    if (!toAttendIncident) return;

    updateIncidentMutate(
      {
        id: toAttendIncident.id,
        updatedItem: {
          attendedAt: dayjs(),
        },
      },
      {
        onSuccess: () => {
          setToAttendIncident(null);
        },
      },
    );
  };

  const columns = useIncidentsColumns();

  const table = useBaseTable<Incident>({
    columns,
    data: directionIncidents || [],
    tableId: 'incidents-table',
    isLoading: isLoading,
    isFetching: isFetching,
    error: error?.message,
    refetchFn: () => refetch(),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 170px)',
    enableRowActions: true,
    enableEditing: false,
    positionActionsColumn: 'first',
    renderRowActions: ({ row }) => {
      const isAttended = row.original.attendedAt;
      return (
        <Box sx={{ display: 'flex' }}>
          <Tooltip
            title={isAttended ? 'Incidencia atendida' : 'Marcar como atendida'}
          >
            <IconButton
              size="small"
              onClick={() => setToAttendIncident(row.original)}
              disabled={!!isAttended}
            >
              {isAttended ? (
                <CheckBoxIcon color="success" />
              ) : (
                <CheckBoxOutlineBlankIcon />
              )}
            </IconButton>
          </Tooltip>
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
      );
    },
    toolbarActions: (
      <div className="flex items-center gap-4">
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
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <MuiAlertDialog
        open={!!toAttendIncident}
        onClose={() => setToAttendIncident(null)}
        onConfirm={() => onAtttendIncident()}
        confirmButtonText="Confirmar"
        title="Confirmar Incidencia Atendida"
        message="¿Estás seguro de que deseas confirmar esta incidencia?"
        severity="info"
      />

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

export default DirectionIncidentsPage;

