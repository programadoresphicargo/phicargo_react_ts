import { Box, IconButton, Tooltip } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import type { DriverWithRealStatus } from '../models/driver-model';
import DriversWithRealStatus from '../utilities/get-drivers-real-status';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useDriversSummaryColumns } from '../hooks/useDriversSummaryColumns';
import { useMemo } from 'react';
import { useTableState } from '../../core/hooks/useTableState';

const DriverSummaryPage = () => {
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
    tableId: 'availability-summary-drivers-table',
  });

  const { columns } = useDriversSummaryColumns();

  const driversWithStatus = useMemo(() => {
    const vehiclesTransformr = new DriversWithRealStatus(drivers || []);
    return vehiclesTransformr.getVehiclesWithRealStatus();
  }, [drivers]);

  const table = useMaterialReactTable<DriverWithRealStatus>({
    // DATA
    columns,
    data: driversWithStatus || [],
    enableStickyHeader: true,
    // PAGINATION, FILTERS, SORTING
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    positionToolbarAlertBanner: 'bottom',
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    // STATE
    initialState: {
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
      showColumnFilters: true,
      showGlobalFilter: true
    },
    state: { 
      isLoading: isFetching,
      columnFilters,
      globalFilter,
      sorting,
      grouping 
    },
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

  return <MaterialReactTable table={table} />;
};

export default DriverSummaryPage;

