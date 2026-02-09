import { useNavigate } from 'react-router-dom';
import { useShiftQueries } from "../hooks/useShiftQueries";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Actividad } from "../models";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Dialog, IconButton, Tooltip, DialogContent } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from "@heroui/react";
import { useActividadColumns } from '../hooks/useActividadColumns';
import { useShiftsContext } from '../hooks/useShiftsContext';
import dayjs from 'dayjs';

const UltimoViajeOperadores = () => {

  const { branchId } = useShiftsContext();
  const { createShift } = useShiftQueries();

  const navigate = useNavigate();

  const onClose = () => {
    navigate('/turnos');
  };

  const {
    actividad,
    actividadQuery: { isFetching, refetch },
  } = useShiftQueries();

  const { columns } = useActividadColumns();

  const table = useMaterialReactTable<Actividad>({
    columns,
    data: actividad || [],
    localization: MRT_Localization_ES,
    enableStickyHeader: true,
    autoResetPageIndex: false,
    enableSorting: false,
    enableGrouping: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'subheader',
    initialState: {
      showColumnFilters: false,
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
      columnPinning: { right: ['mrt-row-actions'] },
    },
    state: { showProgressBars: isFetching },
    enableRowActions: true,
    renderRowActions: (({ row }) => (
      <Button
        color="primary"
        radius="full"
        size="sm"
        onPress={() => {
          createShift.mutate(
            {
              branchId: branchId,
              vehicleId: row.original.vehicle_id,
              driverId: row.original.driver_id,
              arrivalAt: dayjs(),
              comments: '',
              maneuver1: null,
              maneuver2: null,
            },
            {
              onSuccess: () => navigate('/turnos'),
            },
          );
        }}
      >
        Ingresar a turnos
      </Button>
    )),
    renderTopToolbarCustomActions: () => (
      <div className="flex items-center gap-4">
        <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
          Último viaje
        </h1>
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
    muiTableContainerProps: { sx: { height: 'calc(100vh - 330px)' } },
    muiTablePaperProps: { elevation: 0, sx: { borderRadius: '0' } },
    defaultColumn: {
      muiTableHeadCellProps: {
        sx: { fontFamily: 'Inter', fontWeight: 'Bold', fontSize: '14px' },
      },
      muiTableBodyCellProps: {
        sx: { fontFamily: 'Inter', fontWeight: 'normal', fontSize: '12px', padding: '2px' },
      },
    },
  });

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="xl">
      <AppBar
        sx={{ position: 'relative', background: 'linear-gradient(90deg, #841b18 0%, #841b18 100%)', color: 'white' }}
        elevation={0}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Última actividad
          </Typography>
          <Button autoFocus onPress={onClose} color="default" radius="full" variant="bordered">
            Cancelar
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent>
        <MaterialReactTable table={table} />
      </DialogContent>
    </Dialog>
  );
};

export default UltimoViajeOperadores;
