import { Box, IconButton, Tooltip } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import RefreshIcon from '@mui/icons-material/Refresh';
import type { VehicleWithRealStatus } from '../models/vehicle-model';
import VehiclesWithRealStatus from '../utilities/get-vehicles-real-status';
import { useMemo } from 'react';
import { useSummaryColumns } from '../hooks/useSummaryColumns';
import { useVehicleQueries } from '../hooks/useVehicleQueries';

const SummaryPage = () => {
  const {
    vehicleQuery: { data: vehicles, isFetching, refetch },
  } = useVehicleQueries();

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
    columnFilterDisplayMode: 'popover',
    // STATE
    initialState: {
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
    },
    state: { isLoading: isFetching },
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
    <MaterialReactTable table={table} />
  );
};

export default SummaryPage;

