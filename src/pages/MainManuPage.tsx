import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import logo from '../assets/img/phicargo_logo_white.png';
import fondo2 from '../assets/img/tract_scannia.jpg';

import AvatarProfile from '@/components/ui/AvatarProfile';
import { useAuthContext } from '@/modules/auth/hooks';
import {
  menuItems,
  type MenuItemType,
} from '../pages/MenuItems';

import './menu_style.css';

// Filtra los módulos y las carpetas de forma recursiva.
const filterMenuItems = (
  items: MenuItemType[],
  permissions?: number[],
): MenuItemType[] => {
  return items.reduce<MenuItemType[]>((result, item) => {
    // Las carpetas se muestran si contienen al menos un módulo accesible.
    if (item.children) {
      const visibleChildren = filterMenuItems(
        item.children,
        permissions,
      );

      if (visibleChildren.length > 0) {
        result.push({
          ...item,
          children: visibleChildren,
        });
      }

      return result;
    }

    // Los módulos directos requieren al menos uno de sus permisos.
    const hasPermission = item.requiredPermissions.some(
      (permission) => permissions?.includes(permission),
    );

    if (hasPermission) {
      result.push(item);
    }

    return result;
  }, []);
};

const MainMenuPage = () => {
  const navigate = useNavigate();
  const { session } = useAuthContext();

  const permissions = session?.user?.permissions;

  const [folderStack, setFolderStack] = useState<MenuItemType[]>([]);

  const filteredMenuItems = useMemo(
    () => filterMenuItems(menuItems, permissions),
    [permissions],
  );

  const activeFolder = folderStack[folderStack.length - 1] ?? null;

  const closeModal = () => {
    setFolderStack([]);
  };

  // Permite cerrar el modal con Escape.
  useEffect(() => {
    if (folderStack.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFolderStack([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [folderStack.length]);

  const handleMenuItemClick = (item: MenuItemType) => {
    if (item.children?.length) {
      setFolderStack((current) => [...current, item]);
      return;
    }

    if (item.link) {
      closeModal();
      navigate(item.link);
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 140,
        damping: 18,
      },
    },
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#0B2149] text-white"
      style={{
        backgroundImage: `
          linear-gradient(
            120deg,
            rgba(242, 140, 0, 0.90) 0%,
            rgba(255, 107, 0, 0.80) 48%,
            rgba(255, 107, 0, 0.90) 100%
          ),
          url(${fondo2})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Luces ambientales */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -right-40 -top-40
          size-[500px] rounded-full bg-blue-400/15
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -bottom-48 -left-40
          size-[450px] rounded-full bg-cyan-300/10
          blur-[120px]
        "
      />

      {/* Contenido principal */}
      <div
        className="
          relative z-10 mx-auto w-full max-w-[1600px]
          px-5 pb-10 pt-3 sm:px-8 lg:px-12
        "
      >
        {/* Encabezado */}
        <header className="flex h-[84px] items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-xl">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="size-5"
                aria-hidden="true"
              >
                <path
                  d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="7.5" cy="18" r="1.8" />
                <circle cx="17.5" cy="18" r="1.8" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-bold tracking-[0.16em]">
                PHI CARGO APP
              </p>
              <p className="mt-0.5 text-[9px] font-medium tracking-[0.18em] text-blue-200/75">
                MENÚ PRINCIPAL
              </p>
            </div>
          </div>

          <AvatarProfile />
        </header>

        {/* Logotipo */}
        <section className="flex justify-center py-10 text-center sm:py-14">
          <motion.img
            src={logo}
            alt="Phi Cargo"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.6 }}
            transition={{
              duration: 0.65,
              ease: 'easeOut',
            }}
            className="
              mb-8 h-auto w-52 object-contain
              drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)]
              sm:w-60 md:w-64
            "
          />
        </section>

        {/* Tarjetas del menú principal */}
        <motion.section
          aria-label="Módulos del sistema"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="
            mx-auto grid max-w-5xl
            grid-cols-2 gap-3
            sm:gap-5 md:grid-cols-3 lg:grid-cols-4
          "
        >
          {filteredMenuItems.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="min-w-0"
            >
              <MenuItem
                item={item}
                onClick={() => handleMenuItemClick(item)}
              />
            </motion.div>
          ))}
        </motion.section>

        {/* Pie de página */}
        <footer
          className="
            mt-12 flex flex-col items-center gap-2
            border-t border-white/15 pt-6 text-center
          "
        >
          <p className="text-[10px] font-medium tracking-[0.2em] text-white/60">
            PHI CARGO
          </p>
          <p className="text-[10px] text-blue-100/50">2026</p>
        </footer>
      </div>

      {/* Modal de carpetas */}
      <AnimatePresence>
        {activeFolder && (
          <motion.div
            key="folder-modal"
            className="
              fixed inset-0 z-50 flex items-center justify-center
              overflow-y-auto bg-[#020817]/70 p-3
              backdrop-blur-md sm:p-6
            "
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="folder-modal-title"
              className="
                liquid-glass relative my-auto w-full max-w-3xl
                overflow-hidden rounded-3xl border border-white/20
                bg-[#0B2149]/85 p-5 text-white
                shadow-[0_25px_100px_rgba(0,0,0,0.45)]
                backdrop-blur-2xl sm:p-8
              "
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
              }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {/* Encabezado del modal */}
              <div className="mb-7 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {folderStack.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFolderStack((current) =>
                          current.slice(0, -1),
                        );
                      }}
                      className="
                        mb-3 inline-flex items-center gap-2
                        rounded-lg px-2 py-1 text-xs text-blue-200
                        transition hover:bg-white/10 hover:text-white
                        focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-white/70
                      "
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="size-4"
                        aria-hidden="true"
                      >
                        <path
                          d="m15 18-6-6 6-6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Carpeta anterior
                    </button>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-xl">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="size-6"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 7.5A1.5 1.5 0 0 1 4.5 6h5l2 2H19.5A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <h2
                        id="folder-modal-title"
                        className="truncate text-xl font-bold sm:text-2xl"
                      >
                        {activeFolder.label}
                      </h2>
                      <p className="mt-1 text-xs text-blue-100/65 sm:text-sm">
                        Selecciona un módulo para continuar
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Cerrar ventana"
                  className="
                    flex size-10 shrink-0 items-center justify-center
                    rounded-xl border border-white/10 bg-white/5
                    text-white/70 transition hover:bg-white/15
                    hover:text-white
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-white/70
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="size-5"
                    aria-hidden="true"
                  >
                    <path
                      d="m18 6-12 12M6 6l12 12"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Accesos de la carpeta */}
              <motion.div
                key={activeFolder.label}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="
                  grid grid-cols-2 gap-3
                  sm:grid-cols-3 sm:gap-4
                "
              >
                {(activeFolder.children ?? []).map((item) => (
                  <motion.div
                    key={item.label}
                    variants={itemVariants}
                    className="min-w-0"
                  >
                    <MenuItem
                      item={item}
                      onClick={() => handleMenuItemClick(item)}
                      compact
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pie del modal */}
              <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-4">
                <p className="text-[10px] tracking-[0.16em] text-white/45">
                  PHI CARGO APP
                </p>
                <p className="text-xs text-blue-100/50">
                  {(activeFolder.children ?? []).length}{' '}
                  {(activeFolder.children ?? []).length === 1
                    ? 'módulo'
                    : 'módulos'}
                </p>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

interface MenuItemProps {
  item: MenuItemType;
  onClick: () => void;
  compact?: boolean;
}

const MenuItem = ({
  item,
  onClick,
  compact = false,
}: MenuItemProps) => {
  const isFolder = Boolean(item.children?.length);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      aria-label={
        isFolder
          ? `Abrir carpeta ${item.label}`
          : `Abrir módulo ${item.label}`
      }
      className={`
        liquid-glass liquid-glass-card group relative flex w-full
        flex-col items-center justify-center
        ${compact ? 'min-h-[120px] rounded-2xl p-3 sm:min-h-[135px] sm:p-4' : 'min-h-[140px] rounded-2xl p-4 sm:min-h-[155px] sm:rounded-3xl'}
        gap-3 sm:gap-4
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-white/70
      `}
    >
      {/* Indicador de carpeta */}
      {isFolder && (
        <span
          className="
            absolute right-3 top-3 flex size-7 items-center
            justify-center rounded-lg border border-white/15
            bg-white/10 text-white/80
          "
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-4"
          >
            <path
              d="m9 18 6-6-6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}

      {/* Icono del módulo */}
      <div className="relative z-10 flex items-center justify-center">
        <img
          src={item.icon}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={`
            object-contain
            drop-shadow-[0_3px_8px_rgba(0,0,0,0.20)]
            transition-transform duration-300
            group-hover:scale-110
            ${compact ? 'size-12 sm:size-14' : 'size-14 sm:size-16'}
          `}
        />
      </div>

      {/* Nombre del módulo */}
      <span
        className={`
          relative z-10 text-center font-semibold leading-5
          text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]
          ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-[15px]'}
        `}
      >
        {item.label}
      </span>
    </motion.button>
  );
};

export default MainMenuPage;