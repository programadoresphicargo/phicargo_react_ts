import { ExportConfig, ExportToExcel } from '@/utilities';
import { IconButton, Tooltip } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Outlet, useNavigate } from 'react-router-dom';

import { AddButton } from '@/components/ui';
import { Button } from '@heroui/react';
import ExportExcelButton from '@/components/ui/buttons/ExportExcelButton';
import { HiQueueList } from 'react-icons/hi2';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { Shift } from '../models/shift-model';
import { useReorderShifts } from '../hooks/useReorderShifts';
import { useShiftColumns } from '../hooks/useShiftColumns';
import { useShiftQueries } from '../hooks/useShiftQueries';

const ShiftsPage = () => {
  const navigate = useNavigate();
  const { columns } = useShiftColumns();
  const {
    shiftQuery: { data: shifts, isFetching, refetch },
  } = useShiftQueries();

  const { data, handleRowOrderChange, saveChanges } = useReorderShifts(
    shifts || [],
  );

  const onOpenDetails = (id: number) => {
    navigate(`/turnos/detalles/${id}`);
  };

  const table = useMaterialReactTable<Shift>({
    // DATA
    columns,
    data: data,
    localization: MRT_Localization_ES,
    enableStickyHeader: true,
    autoResetPageIndex: false,
    // PAGINATION, FILTERS, SORTING
    enableRowActions: false,
    enableRowOrdering: true,
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
      onDoubleClick: () => onOpenDetails(row.original.id),
      sx: { cursor: 'pointer' },
    }),
    muiRowDragHandleProps: ({ table, row }) => ({
      disabled: row.original.locked,
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        handleRowOrderChange(draggingRow, hoveredRow);
        saveChanges();
      },
    }),
    renderTopToolbarCustomActions: () => (
      <div className="flex items-center gap-4">
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <AddButton
          label="Ingresar turno"
          onClick={() => navigate('/turnos/crear')}
        />
        <Button
          size="sm"
          variant="flat"
          color="secondary"
          className="font-bold"
          startContent={<HiQueueList />}
          onPress={() => navigate('/turnos/cola')}
        >
          Operadores En Cola
        </Button>
        <ExportExcelButton
          size="small"
          onClick={() => exportTo.exportData(data)}
        />
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 212px)',
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
      <MaterialReactTable table={table} />
      <Outlet />
    </>
  );
};

export default ShiftsPage;

const exportConf: ExportConfig<Shift> = {
  fileName: 'Turnos',
  withDate: true,
  columns: [
    { accessorFn: (data) => data.shift, header: 'Turno', columnWidth: 50 },
    { accessorFn: (data) => data.driver.modality, header: 'Licencia' },
    {
      accessorFn: (data) => (data.driver.isDangerous ? 'SI' : 'NO'),
      header: 'Peligroso',
    },
    { accessorFn: (data) => data.vehicle.name, header: 'Unidad' },
    {
      accessorFn: (data) => data.arrivalAt.format('DD/MM/YYYY hh:mm A'),
      header: 'Llegada',
    },
    { accessorFn: (data) => data.maneuver1, header: 'Maniobra #1' },
    { accessorFn: (data) => data.maneuver2, header: 'Maniobra #2' },
    { accessorFn: (data) => data.comments, header: 'Comentarios' },
  ],
};

const exportTo = new ExportToExcel(exportConf);

