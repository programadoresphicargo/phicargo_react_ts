import { useEffect, useState } from 'react';

import { Spinner } from '@nextui-org/react';
import type { User } from '../../auth/models';
import { usePermissionsQueries } from '../hooks/usePermissionsQueries';

interface Props {
  user?: User;
}

const UserPermissions = ({ user }: Props) => {
  const {
    permissionsQuery: { data: permissions, isFetching: isFetchingPermissions },
    userPermissionsQuery: {
      data: userPermissions,
      isFetching: isFetchingUserPermissions,
    },
    addUserPermissionsMutation: { mutate: addUserPermissions, isPending },
  } = usePermissionsQueries({ userId: user?.id });

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((perm) => perm !== id) : [...prev, id],
    );
  };

  const selectAll = () =>
    setSelectedPermissions((permissions || []).map((perm) => perm.id));

  const deselectAll = () => setSelectedPermissions([]);

  const onSubmit = () => {
    if(!user || isPending) return;

    addUserPermissions({
      userId: user.id,
      permissionIds: selectedPermissions,
    });
  }

  useEffect(() => {
    if (!userPermissions) return;
    setSelectedPermissions(userPermissions.map((perm) => perm.permissionId));
  }, [userPermissions]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button
          onClick={selectAll}
          className="text-medium text-blue-500 hover:underline"
        >
          Seleccionar todos
        </button>
        <button
          onClick={deselectAll}
          className="text-medium text-blue-500 hover:underline"
        >
          Deseleccionar todos
        </button>
      </div>

      <ul className="space-y-2 max-h-96 min-h-96 overflow-y-auto">
        {(isFetchingPermissions || !permissions) 
         || ( isFetchingUserPermissions || !userPermissions ) ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          permissions?.map((perm) => (
            <li key={perm.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`perm-${perm.id}`}
                checked={selectedPermissions.includes(perm.id)}
                onChange={() => togglePermission(perm.id)}
                className="h-4 w-4"
              />
              <label htmlFor={`perm-${perm.id}`} className="text-sm">
                <span className="font-medium text-gray-800">{perm.name}</span>
                {perm.description && (
                  <span className="text-gray-700 text-xs">
                    {' '}
                    - {perm.description}
                  </span>
                )}
              </label>
            </li>
          ))
        )}
      </ul>

      <div className=" flex justify-end">
        <button
          onClick={onSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default UserPermissions;

