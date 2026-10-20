
import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import AppsIcon from '@mui/icons-material/Apps';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { Button } from '@heroui/react';

import { menuItems, type MenuItemType } from './MenuItems';
import { useAuthContext } from '@/modules/auth/hooks';

interface MenuPosition {
  top: number;
  right: number;
}

export default function GoogleAppsMenu() {
  const [open, setOpen] = useState(false);
  const [folderStack, setFolderStack] = useState<MenuItemType[]>([]);

  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 12,
    right: 12,
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { session } = useAuthContext();

  // Filtrar permisos de forma recursiva.
  // Una carpeta solo se muestra si contiene elementos accesibles.
  const filteredMenuItems = useMemo(() => {
    const permissions = session?.user?.permissions ?? [];

    const filterItems = (
      items: MenuItemType[],
    ): MenuItemType[] => {
      return items.reduce<MenuItemType[]>((result, item) => {
        if (item.children?.length) {
          const visibleChildren = filterItems(item.children);

          if (visibleChildren.length > 0) {
            result.push({
              ...item,
              children: visibleChildren,
            });
          }

          return result;
        }

        const hasPermission = item.requiredPermissions.some(
          (permission) => permissions.includes(permission),
        );

        if (hasPermission) {
          result.push(item);
        }

        return result;
      }, []);
    };

    return filterItems(menuItems);
  }, [session?.user?.permissions]);

  // Carpeta actual.
  const activeFolder = folderStack[folderStack.length - 1];

  // Elementos que se muestran en el panel.
  const visibleItems =
    activeFolder?.children ?? filteredMenuItems;

  // Calcular una posición que mantenga el panel dentro de la pantalla.
  const updateMenuPosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const panelWidth = Math.min(360, viewportWidth - 24);
    const desiredRight = viewportWidth - rect.right;

    const right = Math.min(
      Math.max(12, desiredRight),
      Math.max(12, viewportWidth - panelWidth - 12),
    );

    const panelHeight = panelRef.current?.offsetHeight ?? 520;

    const maxTop = Math.max(
      12,
      viewportHeight - panelHeight - 12,
    );

    const top = Math.min(
      Math.max(12, rect.bottom + 12),
      maxTop,
    );

    setMenuPosition({ top, right });
  };

  // Abrir y cerrar el menú.
  const toggleMenu = () => {
    if (!open) {
      setFolderStack([]);
      updateMenuPosition();
    } else {
      setFolderStack([]);
    }

    setOpen((previous) => !previous);
  };

  // Abrir una carpeta o navegar a una aplicación.
  const handleItemClick = (item: MenuItemType) => {
    if (item.children?.length) {
      setFolderStack((previous) => [...previous, item]);
      return;
    }

    if (item.link) {
      setOpen(false);
      setFolderStack([]);
      navigate(item.link);
    }
  };

  // Regresar a la carpeta anterior.
  const handleBackFolder = () => {
    setFolderStack((previous) => previous.slice(0, -1));
  };

  // Cerrar y restablecer el menú.
  const handleCloseMenu = () => {
    setOpen(false);
    setFolderStack([]);
  };

  // Cerrar al hacer clic fuera del botón y del panel.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      if (
        !menuRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        handleCloseMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, []);

  // Cerrar con Escape.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        if (folderStack.length > 0) {
          handleBackFolder();
        } else {
          handleCloseMenu();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, folderStack.length]);

  // Actualizar posición cuando cambia el viewport o hay scroll.
  useEffect(() => {
    if (!open) return;

    const handleViewportChange = () => {
      if (
        buttonRef.current &&
        !buttonRef.current.getClientRects().length
      ) {
        handleCloseMenu();
        return;
      }

      updateMenuPosition();
    };

    handleViewportChange();

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener(
      'scroll',
      handleViewportChange,
      true,
    );

    return () => {
      window.removeEventListener(
        'resize',
        handleViewportChange,
      );

      window.removeEventListener(
        'scroll',
        handleViewportChange,
        true,
      );
    };
  }, [open]);

  // Animación del panel.
  const panelVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut' as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      y: -5,
      transition: {
        duration: 0.14,
        ease: 'easeIn' as const,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 6,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.18,
      },
    },
  };

  return (
    <>
      {/* Botón de aplicaciones del navbar */}
      <div ref={menuRef} className="relative">
        <IconButton
          ref={buttonRef}
          aria-label="Abrir aplicaciones"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={toggleMenu}
          sx={{
            mr: 2,
            width: 42,
            height: 42,
            color: 'inherit',
            border: '1px solid',
            borderColor: open
              ? 'rgba(255,255,255,0.28)'
              : 'transparent',
            backgroundColor: open
              ? 'rgba(255,255,255,0.13)'
              : 'transparent',
            transition: 'all 200ms ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.18)',
            },
          }}
        >
          <AppsIcon sx={{ fontSize: 23 }} />
        </IconButton>
      </div>

      {/* Panel flotante */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={panelRef}
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  position: 'fixed',
                  top: menuPosition.top,
                  right: menuPosition.right,
                  zIndex: 99999,
                  transformOrigin: 'top right',
                  maxHeight: 'calc(100dvh - 24px)',
                }}
                className="
                  relative flex flex-col
                  w-[360px] max-w-[calc(100vw-24px)]
                  overflow-hidden rounded-[28px]
                  border border-white/20
                  bg-[#10284d]/90
                  text-white
                  shadow-[0_24px_70px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.16)]
                  backdrop-blur-2xl
                "
              >
                {/* Reflejo superior */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-x-8 top-0
                    z-10 h-px bg-gradient-to-r
                    from-transparent via-white/60 to-transparent
                  "
                />

                {/* Luz ambiental */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute -right-16 -top-16
                    size-40 rounded-full
                    bg-blue-400/15 blur-3xl
                  "
                />

                {/* Encabezado: título o carpeta actual */}
                <div className="relative flex shrink-0 items-center gap-3 px-5 pb-4 pt-5">
                  {activeFolder && (
                    <IconButton
                      aria-label="Volver a la carpeta anterior"
                      onClick={handleBackFolder}
                      sx={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        '&:hover': {
                          backgroundColor:
                            'rgba(255,255,255,0.12)',
                        },
                      }}
                    >
                      <ArrowBackIosNewIcon
                        sx={{ fontSize: 15 }}
                      />
                    </IconButton>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[15px] font-semibold tracking-tight text-white">
                      {activeFolder?.label ?? 'Aplicaciones'}
                    </h2>

                    <p className="mt-1 text-xs text-blue-100/55">
                      {activeFolder
                        ? 'Aplicaciones de esta carpeta'
                        : 'Tus herramientas de trabajo'}
                    </p>
                  </div>

                  <IconButton
                    aria-label="Cerrar aplicaciones"
                    onClick={handleCloseMenu}
                    sx={{
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                      color: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        backgroundColor:
                          'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 19 }} />
                  </IconButton>
                </div>

                <div className="mx-5 h-px shrink-0 bg-white/10" />

                {/* Lista de aplicaciones y carpetas */}
                <motion.div
                  key={activeFolder?.label ?? 'root'}
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.035,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  className="
                    relative grid min-h-0 flex-1
                    grid-cols-3
                    gap-x-2 gap-y-3 px-4 py-4
                    overflow-y-auto overscroll-contain
                  "
                >
                  {visibleItems.map((app) => {
                    const isFolder = Boolean(
                      app.children?.length,
                    );

                    return (
                      <motion.button
                        key={app.link ?? app.label}
                        type="button"
                        variants={itemVariants}
                        onClick={() => handleItemClick(app)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        aria-label={
                          isFolder
                            ? `Abrir carpeta ${app.label}`
                            : `Abrir ${app.label}`
                        }
                        className="
                          group flex min-h-[100px] min-w-0
                          flex-col items-center justify-center
                          gap-2 rounded-2xl px-2 py-3
                          text-center transition-colors duration-200
                          hover:bg-white/[0.09]
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-blue-300
                        "
                      >
                        {/* Icono de aplicación o carpeta */}
                        <span
                          className="
                            relative flex size-12 shrink-0
                            items-center justify-center
                            transition-transform duration-200
                            group-hover:scale-110
                          "
                        >
                          {isFolder ? (
                            <>
                              {app.icon ? (
                                <img
                                  src={app.icon}
                                  alt=""
                                  aria-hidden="true"
                                  loading="lazy"
                                  className="max-h-11 max-w-11 object-contain"
                                />
                              ) : (
                                <FolderRoundedIcon
                                  sx={{
                                    fontSize: 43,
                                    color: '#8dbbff',
                                  }}
                                />
                              )}

                              <span
                                className="
                                  absolute -bottom-1 -right-2
                                  flex size-5 items-center justify-center
                                  rounded-full border border-white/20
                                  bg-[#244875] text-[10px] font-semibold
                                  text-white
                                "
                              >
                                {app.children!.length}
                              </span>
                            </>
                          ) : (
                            <img
                              src={app.icon}
                              alt=""
                              aria-hidden="true"
                              loading="lazy"
                              className="
                                max-h-11 max-w-11 object-contain
                                drop-shadow-[0_2px_5px_rgba(0,0,0,0.18)]
                              "
                            />
                          )}
                        </span>

                        <span
                          className="
                            line-clamp-2 w-full break-words
                            text-xs font-medium leading-4
                            text-white/85 transition-colors
                            group-hover:text-white
                          "
                        >
                          {app.label}
                        </span>

                        {isFolder && (
                          <ChevronRightRoundedIcon
                            aria-hidden="true"
                            sx={{
                              position: 'absolute',
                              width: 0,
                              height: 0,
                              overflow: 'hidden',
                            }}
                          />
                        )}
                      </motion.button>
                    );
                  })}

                  {visibleItems.length === 0 && (
                    <p className="col-span-3 py-8 text-center text-sm text-white/60">
                      No tienes aplicaciones disponibles.
                    </p>
                  )}
                </motion.div>

                {/* Pie fijo */}
                <div
                  className="
                    relative shrink-0
                    border-t border-white/10
                    bg-white/[0.035] px-5 py-4
                  "
                >
                  <Button
                    color="primary"
                    onPress={() => {
                      handleCloseMenu();
                      navigate('/menu');
                    }}
                    radius="full"
                    className="
                      h-11 w-full
                      border border-white/15
                      bg-gradient-to-r from-blue-600 to-blue-500
                      text-sm font-semibold text-white
                      shadow-[0_5px_18px_rgba(37,99,235,0.24)]
                      transition-all duration-200
                      hover:brightness-110
                    "
                  >
                    Menú principal
                  </Button>

                  <p className="mt-3 text-center text-[10px] tracking-[0.12em] text-white/35">
                    PHI CARGO
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
