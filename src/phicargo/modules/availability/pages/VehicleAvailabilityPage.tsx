import { Box, Tooltip } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Outlet, useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Vehicle } from '../models/vehicle-model';
import { useVehicleColumns } from '../hooks/useVehicleColumns';
import { useVehicleQueries } from '../hooks/useVehicleQueries';

const AsignacionUnidades = () => {
  const navigate = useNavigate();

  const { columns } = useVehicleColumns();

  const {
    vehicleQuery: { data: vehicles, isFetching, refetch },
  } = useVehicleQueries();

  // const exportToExcel = () => {

  // };

  const table = useMaterialReactTable<Vehicle>({
    // DATA
    columns,
    data: vehicles || [],
    enableStickyHeader: true,
    // PAGINATION, FILTERS, SORTING
    enableGrouping: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'subheader',
    // enableRowSelection: true,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    // STATE
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
    },
    state: {
      isLoading: isFetching,
    },
    // CUSTOMIZATIONS
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => navigate(`detalles/${row.original.id}`),
      sx: { cursor: 'pointer' },
    }),
    renderTopToolbarCustomActions: () => (
      <Box>
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 180px)',
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

export default AsignacionUnidades;

