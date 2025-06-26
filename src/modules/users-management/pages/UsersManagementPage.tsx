import { AddButton } from '@/components/ui';
import { MaterialReactTable } from 'material-react-table';
import { Outlet } from 'react-router-dom';
import type { User } from '../../auth/models';
import { UserCreateForm } from '../components/UserCreateForm';
import { UserInformationModal } from '../components/UserInformationModal';
import { useBaseTable } from '@/hooks';
import { useState } from 'react';
import { useUsersColums } from '../hooks/useUsersColumns';
import { useUsersQueries } from '../hooks/useUsersQueries';

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
    toolbarActions: (
      <AddButton label="Crear Usuario" onClick={() => setCreateModal(true)} />
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

