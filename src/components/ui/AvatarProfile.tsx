
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";

import { useAuthContext } from "@/modules/auth/hooks";
import { useState } from "react";

const images = Object.values(
  import.meta.glob("/src/assets/halloween/*.{png,jpg,jpeg,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  })
) as string[];

const AvatarProfile = () => {
  const { session, onLogout } = useAuthContext();

  const [image] = useState(() =>
    images.length
      ? images[Math.floor(Math.random() * images.length)]
      : ""
  );

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <div className="relative cursor-pointer rounded-full">
          <User
            avatarProps={{
              size: "md",
              src: image,
              className:
                "ring-2 ring-orange-400 ring-offset-2 ring-offset-background",
            }}
            description={session?.user.role || ""}
            name={`🪦 ${session?.user.name || ""}`}
          />
        </div>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Profile Actions"
        variant="faded"
        className="min-w-56"
      >
        <DropdownItem
          key="logout"
          color="danger"
          onPress={onLogout}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AvatarProfile;
