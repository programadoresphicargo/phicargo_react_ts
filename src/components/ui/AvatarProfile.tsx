import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { User } from "@heroui/react";

import { useAuthContext } from '@/modules/auth/hooks';

const AvatarProfile = () => {
  const { session, onLogout } = useAuthContext();

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          avatarProps={{
            size: "sm",
            src: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
          }}
          description={session?.user.role || ''}
          name={session?.user.name || ''}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="faded">
        <DropdownItem key="logout" color="danger" onClick={onLogout}>
          Cerrar Sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AvatarProfile;

