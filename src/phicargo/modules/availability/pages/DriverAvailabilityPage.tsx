import { Box, IconButton, Tooltip } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

import { Driver } from '../models/driver-model';
import MaterialTableBase from '../../core/components/tables/MaterialTableBase';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useDriversColumns } from '../hooks/useDriversColumns';
import { useMaterialReactTable } from 'material-react-table';
import { useTableState } from '../../core/hooks/useTableState';

const DriverAvailabilityPage = () => {
  const navigate = useNavigate();

  const {
    driversQuery: { data: drivers, isFetching, refetch },
  } = useDriverQueries();

  const {
    columnFilters,
    globalFilter,
    sorting,
    grouping,
    setColumnFilters,
    setGlobalFilter,
    setSorting,
    setGrouping,
  } = useTableState({
    tableId: 'availability-drivers-table',
  });

  const { columns } = useDriversColumns();

  const table = useMaterialReactTable<Driver>({
    // DATA
    columns,
    data: drivers || [],
    enableStickyHeader: true,
    memoMode: 'cells',
    // PAGINATION, FILTERS, SORTING
    enableGrouping: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'subheader',
    positionToolbarAlertBanner: 'bottom',
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    // STATE
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
      showGlobalFilter: true
    },
    state: {
      isLoading: isFetching,
      columnFilters,
      globalFilter,
      sorting,
      grouping,
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
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 180px)',
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

export default DriverAvailabilityPage;

