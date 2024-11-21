import Box from '@mui/material/Box';
import type { Driver } from '../../models/driver-model';
import EditModal from '../EditModal';
import IconButton from '@mui/material/IconButton';
import MaterialTableBase from './MaterialTableBase';
import RefreshIcon from '@mui/icons-material/Refresh';
import Tooltip from '@mui/material/Tooltip';
import { useDriverQueries } from '../../hooks/useDriverQueries';
import { useDriversColumns } from '../../hooks/useDriversColumns';
import { useMaterialReactTable } from 'material-react-table';
import { useState } from 'react';

const DriverTable = () => {
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
    // ACTIONS
    enableRowActions: true,
    positionActionsColumn: 'first',
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
        maxHeight: 'calc(100vh - 180px)',
      },
    },
  });

  return (
    <>
      <MaterialTableBase table={table} />
      {editId && (
        <EditModal 
          onClose={() => setEditId(null)}
          driverId={editId}
        />
      )}
    </>
);
};

export default DriverTable;
