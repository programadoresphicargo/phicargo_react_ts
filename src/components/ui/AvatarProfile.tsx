
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";

import { useAuthContext } from "@/modules/auth/hooks";
import { useState } from "react";
import zombieAnimation from '@/assets/halloween_2/Death Dance.json';
import { Lottie } from "lottie-react";

// Cargar las imágenes disponibles
const images = Object.entries(
  import.meta.glob("/src/assets/halloween/*.{png,jpg,jpeg,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  })
)
  .map(([path, url]) => ({
    name: path.split("/").pop() || path,
    src: url as string,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const DEFAULT_IMAGE = "Jack-o-lantern-01.png";
const STORAGE_KEY = "phicargo-avatar";

// Obtener el avatar guardado o el predeterminado
const getInitialImage = () => {
  const savedImage = localStorage.getItem(STORAGE_KEY);

  if (savedImage) {
    const saved = images.find((item) => item.name === savedImage);

    if (saved) return saved.src;
  }

  const defaultImage = images.find(
    (item) => item.name === DEFAULT_IMAGE
  );

  return defaultImage?.src || images[0]?.src || "";
};

const AvatarProfile = () => {
  const { session, onLogout } = useAuthContext();

  const [image, setImage] = useState(getInitialImage);

  const {
    isOpen,
    onOpen,
    onOpenChange,
  } = useDisclosure();

  // Guardar el avatar seleccionado
  const selectImage = (src: string, name: string) => {
    localStorage.setItem(STORAGE_KEY, name);
    setImage(src);
  };

  const pathname = window.location.pathname;

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <div className="flex cursor-pointer items-center gap-2 rounded-full">
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
            {pathname == "/menu" && (
              <Lottie
                src={zombieAnimation}
                loop
                autoplay
                style={{ height: 50, width: 50 }}
              />
            )}
          </div>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Profile Actions"
          variant="faded"
          className="min-w-56"
        >
          <DropdownItem
            key="change-avatar"
            onPress={onOpen}
            textValue="Cambiar avatar"
          >
            🎃 Cambiar avatar
          </DropdownItem>

          <DropdownItem
            key="logout"
            color="danger"
            onPress={onLogout}
          >
            Cerrar sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Modal para seleccionar avatar */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        scrollBehavior="inside"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span>Seleccionar avatar 🎃</span>
                <span className="text-sm font-normal text-default-500">
                  Elige tu personaje.
                </span>
              </ModalHeader>

              <ModalBody>
                {images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 pb-4 sm:grid-cols-4">
                    {images.map((avatar) => {
                      const isSelected = image === avatar.src;

                      return (
                        <button
                          key={avatar.name}
                          type="button"
                          onClick={() => {
                            selectImage(avatar.src, avatar.name);
                            onClose();
                          }}
                          aria-label={`Seleccionar ${avatar.name}`}
                          aria-pressed={isSelected}
                          className={`flex min-w-0 flex-col items-center gap-2 rounded-xl border p-3 transition-colors hover:bg-default-100 ${isSelected
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                            : "border-default-200"
                            }`}
                        >
                          <div className="relative">
                            <img
                              src={avatar.src}
                              alt={avatar.name}
                              loading="lazy"
                              className={`h-16 w-16 rounded-full object-cover ${isSelected
                                ? "ring-2 ring-orange-500 ring-offset-2"
                                : ""
                                }`}
                            />

                            {isSelected && (
                              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                                ✓
                              </span>
                            )}
                          </div>

                          <span className="w-full truncate text-center text-xs text-default-600">
                            {avatar.name.replace(/\.[^.]+$/, "")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-default-500">
                    No se encontraron imágenes de avatares.
                  </p>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AvatarProfile;
