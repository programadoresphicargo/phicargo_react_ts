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
  "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          avatarProps={{
            src: "https://png.pngtree.com/png-vector/20241118/ourmid/pngtree-santa-claus-profile-picture-vector-png-image_14487013.png",
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

