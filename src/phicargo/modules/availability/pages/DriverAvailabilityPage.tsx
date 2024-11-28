import { Box, IconButton, Tooltip } from '@mui/material';

import { Driver } from '../models/driver-model';
import DriverModal from '../components/DriverModal';
import MaterialTableBase from '../../core/components/tables/MaterialTableBase';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useDriversColumns } from '../hooks/useDriversColumns';
import { useMaterialReactTable } from 'material-react-table';
import { useState } from 'react';

const DriverAvailabilityPage = () => {
  const {
    driversQuery: { data: drivers, isFetching, refetch },
  } = useDriverQueries();

  const [editId, setEditId] = useState<number | null>(null);

  const { columns } = useDriversColumns();

  const table = useMaterialReactTable<Driver>({
    // DATA
    columns,
    data: drivers || [],
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
      isLoading: isFetching,
    },
    // CUSTOMIZATIONS
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => setEditId(row.original.id),
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
        maxHeight: 'calc(100vh - 195px)',
      },
    },
  });

  return (
    <>
      <MaterialTableBase table={table} />
      {editId && (
        <DriverModal driverId={editId} onOpenChange={() => setEditId(null)} />
      )}
    </>
  );
};

export default DriverAvailabilityPage;

