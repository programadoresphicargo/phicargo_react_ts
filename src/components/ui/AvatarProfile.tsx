import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { User } from "@heroui/react";

import { useAuthContext } from '@/modules/auth/hooks';
import { useState } from 'react';

const AvatarProfile = () => {
  const { session, onLogout } = useAuthContext();

  const images = Object.values(
    import.meta.glob("/src/assets/halloween/*.{png,jpg,jpeg,webp}", {
      eager: true,
      query: "?url",
      import: "default",
    })
  ) as string[];

  const [image] = useState(
    () => images[Math.floor(Math.random() * images.length)]
  );

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          avatarProps={{
            size: "md",
            src: image,
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

