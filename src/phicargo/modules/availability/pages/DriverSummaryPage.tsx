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

const DriverSummaryPage = () => {
  const {
    driversQuery: { data: drivers, isFetching, refetch },
  } = useDriverQueries();

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

  return <MaterialReactTable table={table} />;
};

export default DriverSummaryPage;

