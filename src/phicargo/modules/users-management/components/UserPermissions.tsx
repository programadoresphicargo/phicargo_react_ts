import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip,
} from '@heroui/react';
import { LoadingSpinner, SaveButton } from '@/components/ui';
import { useEffect, useState } from 'react';

import { IconButton } from '@mui/material';
import { Permission } from '../models';
import { PermissionsList } from './PermissionsList';
import { PermissionsSearchBar } from './PermissionsSearchBar';
import { RiCheckboxFill } from 'react-icons/ri';
import { RiCheckboxIndeterminateFill } from 'react-icons/ri';
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

  const [allPermissions, setAllPermissions] = useState<Permission[]>(
    permissions || [],
  );
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
    if (!user || isPending) return;

    addUserPermissions({
      userId: user.id,
      permissionIds: selectedPermissions,
    });
  };

  useEffect(() => {
    if (!userPermissions) return;
    setSelectedPermissions(userPermissions.map((perm) => perm.permissionId));
  }, [userPermissions]);

  return (
    <>
      <Card
        classNames={{
          base: 'shadow-none',
          header: 'bg-gray-100 px-4 py-2',
          body: 'overflow-y-auto h-[420px]',
        }}
        radius="md"
      >
        <CardHeader className="flex items-center justify-between">
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-4">
              <div className="bg-blue-100 rounded-full hover:bg-blue-600">
                <Tooltip
                  content="Marcar Todo"
                  placement="top"
                  color="primary"
                  showArrow
                >
                  <IconButton aria-label="select-all" onClick={selectAll}>
                    <RiCheckboxFill className="text-blue-500" />
                  </IconButton>
                </Tooltip>
              </div>

              <div className="bg-blue-100 rounded-full hover:bg-blue-600">
                <Tooltip
                  content="Marcar Todo"
                  placement="top"
                  color="warning"
                  showArrow
                >
                  <IconButton aria-label="unselect-all" onClick={deselectAll}>
                    <RiCheckboxIndeterminateFill className="text-orange-400" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <PermissionsSearchBar
              permissions={permissions || []}
              setAllPermissions={setAllPermissions}
            />
          </div>
        </CardHeader>
        <CardBody>
          {isFetchingPermissions || isFetchingUserPermissions ? (
            <LoadingSpinner />
          ) : (
            <PermissionsList
              permissionsList={allPermissions}
              selectedPermissions={selectedPermissions}
              togglePermission={togglePermission}
            />
          )}
        </CardBody>
        <CardFooter className="pt-0">
          <SaveButton
            onPress={onSubmit}
            className="w-full uppercase"
            isLoading={isPending}
            variant="flat"
          >
            Guardar
          </SaveButton>
        </CardFooter>
      </Card>

      {/* <div className="flex justify-center items-center transition-all duration-300 ease-in-out">
        {isFetchingPermissions || isFetchingUserPermissions ? (
          <div className="min-h-[383px]">
            <Spinner />
          </div>
        ) : (
          <PermissionsList
            permissionsList={allPermissions}
            selectedPermissions={selectedPermissions}
            togglePermission={togglePermission}
          />
        )}
      </div> */}

      {/* <div className=" flex justify-end">
        <Button color="primary" onPress={onSubmit}>
          Guardar
        </Button>
      </div> */}
    </>
  );
};

export default UserPermissions;

