import { Box, IconButton, Tooltip } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

import MaterialTableBase from '../../core/components/tables/MaterialTableBase';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { Shift } from '../models/shift-model';
import { useMaterialReactTable } from 'material-react-table';
import { useShiftColumns } from '../hooks/useShiftColumns';

const ShiftsPage = () => {
  const navigate = useNavigate();

  const { columns } = useShiftColumns();

  const table = useMaterialReactTable<Shift>({
    // DATA
    columns,
    data: [],
    enableStickyHeader: true,
    // PAGINATION, FILTERS, SORTING
    enableGrouping: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'subheader',
    // STATE
    initialState: {
      showColumnFilters: false,
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
    },
    state: {
      // isLoading: isFetching,
    },
    // CUSTOMIZATIONS
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () =>
        navigate(`/disponibilidad/operadores/detalles/${row.original.id}`),
      sx: { cursor: 'pointer' },
    }),
    renderTopToolbarCustomActions: () => (
      <Box>
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={() => {}}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 195px)',
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
