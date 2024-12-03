import { IconButton, Tooltip } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Outlet, useNavigate } from 'react-router-dom';

import AddButton from '../../core/components/ui/AddButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { User } from '../../auth/models';
import { useUsersColums } from '../hooks/useUsersColumns';
import { useUsersQueries } from '../hooks/useUsersQueries';

const UsersManagementPage = () => {
  const navigate = useNavigate();
  const { columns } = useUsersColums();
  const {
    usersQuery: { data: users, isFetching, refetch },
  } = useUsersQueries();

  const table = useMaterialReactTable<User>({
    // DATA
    columns,
    data: users || [],
    enableStickyHeader: true,
    // PAGINATION, FILTERS, SORTING
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnPinning: true,
    columnResizeMode: 'onEnd',
    // STATE
    state: { isLoading: isFetching },
    initialState: {
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => navigate(`/control-usuarios/usuarios/detalles/${row.original.id}`),
      sx: { cursor: 'pointer' },
    }),
    renderTopToolbarCustomActions: () => (
      <div className="flex flex-row gap-2">
        <div className="flex flex-row items-center rounded-xl">
          <Tooltip arrow title="Refrescar">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div className="flex flex-row items-center">
          <AddButton label="Crear Usuario" />
        </div>
      </div>
    ),
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 195px)',
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

export default UsersManagementPage;

