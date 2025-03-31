import { Tab, Tabs } from '@heroui/react';

import { Modal } from '@/components';
import type { User } from '../../auth/models';
import UserForm from './UserForm';
import UserPermissions from './UserPermissions';
import { useGetUserQuery } from '../hooks/useGetUserQuery';

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
}

export const UserInformationModal = ({ open, onClose, user }: Props) => {
  const { data: fullUser } = useGetUserQuery(Number(user.id));

  return (
    <Modal
      isOpen={open}
      onOpenChange={onClose}
      showFooter={false}
      header={
        <h2 className="uppercase font-thin">
          Usuario: <span className="font-bold">{user.name}</span>
        </h2>
      }
      size="3xl"
    >
      <Tabs
        aria-label="driver-sections"
        variant="underlined"
        color="primary"
        fullWidth
        classNames={{
          panel: 'px-4',
          tabContent: 'font-bold uppercase',
        }}
      >
        <Tab key="information" title="Información">
          <UserForm user={fullUser} />
        </Tab>
        <Tab key="user-permissions" title="Permisos">
          <UserPermissions user={fullUser} />
        </Tab>
      </Tabs>
    </Modal>
  );
};

