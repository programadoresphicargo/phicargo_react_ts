import { MaterialReactTable } from 'material-react-table';
import { Outlet } from 'react-router-dom';
import type { User } from '../../auth/models';
import { UserCreateForm } from '../components/UserCreateForm';
import { UserInformationModal } from '../components/UserInformationModal';
import { useBaseTable } from '@/hooks';
import { useState } from 'react';
import { useUsersColums } from '../hooks/useUsersColumns';
import { useUsersQueries } from '../hooks/useUsersQueries';
import { Button } from '@heroui/react';

const UsersManagementPage = () => {
  const { columns } = useUsersColums();
  const [createModal, setCreateModal] = useState(false);
  const [informationModal, setInformationModal] = useState<User | null>(null);

  const {
    usersQuery: { data: users, isFetching, isLoading, refetch },
  } = useUsersQueries();

  const table2 = useBaseTable<User>({
    columns,
    data: users || [],
    isLoading,
    isFetching,
    refetchFn: refetch,
    tableId: 'users-table',
    containerHeight: 'calc(100vh - 173px)',
    showGlobalFilter: true,
    showColumnFilters: true,
    muiTopToolbarProps: {
      sx: {
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',
        '& .MuiSvgIcon-root': {
          color: 'white',   // 🎨 iconos en blanco
        },
        '& .MuiButton-root': {
          color: 'white',   // texto de botones en blanco
        },
        '& .MuiInputBase-root': {
          color: 'white',   // texto del buscador
        },
        '& .MuiInputBase-root .MuiSvgIcon-root': {
          color: 'white',   // icono de lupa en blanco
        },
      },
    },
    toolbarActions: (
      <Button
        onPress={() => setCreateModal(true)}
        color='primary'
        radius='full'>Crear Usuario</Button>
    ),
    onDoubleClickFn: (row) => {
      setInformationModal(row.original);
    },
  });

  return (
    <>
      <MaterialReactTable table={table2} />
      {informationModal && (
        <UserInformationModal
          open={!!informationModal}
          onClose={() => setInformationModal(null)}
          user={informationModal}
        />
      )}
      <UserCreateForm
        open={createModal}
        onClose={() => setCreateModal(false)}
      />
      <Outlet />
    </>
  );
};

export default UsersManagementPage;

