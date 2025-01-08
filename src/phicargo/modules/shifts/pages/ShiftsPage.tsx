import { IconButton, Tooltip } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

import AddButton from '../../core/components/ui/AddButton';
import { Button } from '@nextui-org/react';
import {
  ExportToExcel,
  type ExportConfig,
} from '../../core/utilities/export-to-excel';
import ExportExcelButton from '../../core/components/ui/ExportExcelButton';
import { HiQueueList } from 'react-icons/hi2';
import MaterialTableBase from '../../core/components/tables/MaterialTableBase';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { Shift } from '../models/shift-model';
import { useMaterialReactTable } from 'material-react-table';
import { useReorderShifts } from '../hooks/useReorderShifts';
import { useShiftColumns } from '../hooks/useShiftColumns';
import { useShiftQueries } from '../hooks/useShiftQueries';
import { getRowActionMenuItems } from '../components/RowActionsList';
import { TbTruckReturn } from "react-icons/tb";

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
    enableStickyHeader: true,
    autoResetPageIndex: false,
    // PAGINATION, FILTERS, SORTING
    enableRowActions: true,
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
    renderRowActionMenuItems: ({ row, closeMenu }) =>
      getRowActionMenuItems(row.original, closeMenu, onOpenDetails),
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
          size="sm"
          label="Ingresar turno"
          onPress={() => navigate('/turnos/crear')}
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
        <Button
          size="sm"
          variant="flat"
          color="danger"
          className="font-bold"
          startContent={<HiQueueList />}
          onPress={() => navigate('/turnos/incidencias')}
        >
          Conteo de Incidencias
        </Button>
        <ExportExcelButton
          size="sm"
          label="Exportar"
          onPress={() => exportTo.exportData(data)}
        />
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 212px)',
      },
    },
    defaultColumn: {
      muiTableBodyCellProps: {
        sx: {
          padding: '2px',
        },
      },
    },
  });

  return (
    <>
      <MaterialTableBase table={table} />
      <Outlet />
    </>
  );
};

export default ShiftsPage;

