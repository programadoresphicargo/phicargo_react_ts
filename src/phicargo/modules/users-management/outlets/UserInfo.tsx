import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import UserForm from '../components/UserForm';
import UserPermissions from '../components/UserPermissions';
import { useMemo } from 'react';
import { useUsersQueries } from '../hooks/useUsersQueries';

const UserInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { users } = useUsersQueries();

  const user = useMemo(
    () => users.find((user) => user.id === Number(id)),
    [id, users],
  );

  const onClose = () => {
    navigate(`/control-usuarios/usuarios`);
  };

  if (!id) {
    return <Navigate to="/control-usuarios/" replace />;
  }

  return (
    <Modal isOpen={true} onOpenChange={onClose} size="2xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col pb-2 bg-[#dadfeb]">
              <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                Información de Usuario
              </h3>
              <div className="flex justify-center gap-2">
                <div className="flex items-center text-medium">
                  <span className="font-semibold text-gray-800">Usuario:</span>
                  <span className="ml-1 text-gray-700">
                    {user?.name || '...'}
                  </span>
                </div>
                <div className="flex items-center text-medium">
                  <span className="text-gray-800">Rol:</span>
                  <span className="ml-1 text-gray-700">
                    {user?.role || '...'}
                  </span>
                </div>
              </div>
            </ModalHeader>

            <ModalBody>
              <div className="">
                <Tabs
                  aria-label="vehicle-forms"
                  color="primary"
                  variant="bordered"
                  className='flex flex-col flex-1'
                >
                  <Tab key="user-data" title="Datos de Usuario">
                    {user ? <UserForm user={user} /> : <Spinner />}
                  </Tab>
                  <Tab key="user-permissions" title="Permisos">
                    {user ? <UserPermissions user={user} /> : <Spinner />}
                  </Tab>
                </Tabs>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UserInfo;

