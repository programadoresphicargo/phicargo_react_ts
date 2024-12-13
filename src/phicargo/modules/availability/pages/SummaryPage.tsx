import { Box, IconButton, Tooltip } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import RefreshIcon from '@mui/icons-material/Refresh';
import type { VehicleWithRealStatus } from '../models/vehicle-model';
import VehiclesWithRealStatus from '../utilities/get-vehicles-real-status';
import { useMemo } from 'react';
import { useSummaryColumns } from '../hooks/useSummaryColumns';
import { useTableState } from '../../core/hooks/useTableState';
import { useVehicleQueries } from '../hooks/useVehicleQueries';

const SummaryPage = () => {
  const {
    vehicleQuery: { data: vehicles, isFetching, refetch },
  } = useVehicleQueries();

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
    tableId: 'availability-summary-vehicles-table',
  });

  const { columns } = useSummaryColumns();

  const vehiclesWithStatus = useMemo(() => {
    const vehiclesTransformr = new VehiclesWithRealStatus(vehicles || []);
    return vehiclesTransformr.getVehiclesWithRealStatus();
  }, [vehicles]);

  const table = useMaterialReactTable<VehicleWithRealStatus>({
    // DATA
    columns,
    data: vehiclesWithStatus || [],
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
    },
    state: { 
      isLoading: isFetching,
      columnFilters,
      globalFilter,
      sorting,
      grouping, 
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

export default SummaryPage;

