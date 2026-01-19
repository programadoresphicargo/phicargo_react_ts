import {
  CalendarDate,
  DatePicker,
} from "@heroui/react";
import { useNavigate } from 'react-router-dom';
import { useShiftQueries } from "../hooks/useShiftQueries";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Shift } from "../models";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Dialog, IconButton, Tooltip, DialogContent } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useShiftColumnsArchived } from "../hooks/useShiftColumnsArchived";
import { useState } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { UnarchiveDialog } from "../components/UnarchiveDialog";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from "@heroui/react";

const ArchivedsShift = () => {
  const [archivedDate, setArchivedDate] = useState<CalendarDate | null>(today(getLocalTimeZone()));
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [shift, setShift] = useState<Shift | null>(null);

  const navigate = useNavigate();

  const onClose = () => {
    navigate('/turnos');
  };

  const archivedDateString = archivedDate
    ? archivedDate.toString()
    : null;

  const {
    shiftsAssigned,
    shiftAssignedQuery: { isFetching, refetch },
  } = useShiftQueries(archivedDateString);

  const { columns } = useShiftColumnsArchived();

  const table = useMaterialReactTable<Shift>({
    // DATA
    columns,
    data: shiftsAssigned || [],
    localization: MRT_Localization_ES,
    enableStickyHeader: true,
    autoResetPageIndex: false,
    // PAGINATION, FILTERS, SORTING
    enableRowActions: false,
    enableSorting: false,
    enableGrouping: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'subheader',
    getRowId: (row) => String(row.id),
    // STATE
    initialState: {
      showColumnFilters: false,
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
      columnPinning: {
        right: ['mrt-row-actions'],
      },
    },
    state: {
      isLoading: isFetching,
    },
    // CUSTOMIZATIONS
    // renderRowActionMenuItems: ({ row }) =>
    //   getRowActionMenuItems(row.original),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setShift(row.original);
        setArchiveDialogOpen(true);
      },
      sx: { cursor: 'pointer' },
    }),
    renderTopToolbarCustomActions: () => (
      <div className="flex items-center gap-4">
        <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
          Historial asignado
        </h1>
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <DatePicker
          label="Fecha archivado"
          value={archivedDate}
          onChange={setArchivedDate}>
        </DatePicker>
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 230px)',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    defaultColumn: {
      muiTableHeadCellProps: {
        sx: {
          fontFamily: 'Inter',
          fontWeight: 'Bold',
          fontSize: '14px',
        },
      },
      muiTableBodyCellProps: {
        sx: {
          fontFamily: 'Inter',
          fontWeight: 'normal',
          fontSize: '12px',
          padding: '2px'
        },
      },
    },
  });

  return (
    <>
      <Dialog open={true} onClose={onClose} fullWidth maxWidth="xl">

        <AppBar sx={{
          position: 'relative',
          background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
          color: 'white',
        }}
          elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Detalles del turno
            </Typography>
            <Button autoFocus onPress={onClose} color="primary" radius="full">
              Cancelar
            </Button>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <MaterialReactTable table={table} />
        </DialogContent>
      </Dialog>

      {shift && (
        <UnarchiveDialog
          isOpen={archiveDialogOpen}
          onClose={() => {
            setArchiveDialogOpen(false);
            refetch();
          }}
          shiftId={shift.id} />
      )}
    </>
  );
};

export default ArchivedsShift;

