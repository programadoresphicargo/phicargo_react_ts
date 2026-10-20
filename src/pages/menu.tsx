
import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import AppsIcon from '@mui/icons-material/Apps';
import { Button } from '@heroui/react';

import { menuItems } from './MenuItems';
import { useAuthContext } from '@/modules/auth/hooks';

interface MenuPosition {
  top: number;
  right: number;
}

export default function GoogleAppsMenu() {
  const [open, setOpen] = useState(false);

  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 12,
    right: 12,
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { session } = useAuthContext();

  const filteredMenuItems = useMemo(
    () =>
      menuItems.filter((item) =>
        item.requiredPermissions.some((permission) =>
          session?.user?.permissions?.includes(permission),
        ),
      ),
    [session?.user?.permissions],
  );

  // Calcular una posición que mantenga el panel dentro de la pantalla.
  const updateMenuPosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const panelWidth = Math.min(360, viewportWidth - 24);

    // Alinear inicialmente el panel con el botón.
    const desiredRight = viewportWidth - rect.right;

    const right = Math.min(
      Math.max(20, desiredRight),
      Math.max(20, window.innerWidth - panelWidth - 20),
    );

    // Usar la altura real del panel cuando esté montado.
    const panelHeight = panelRef.current?.offsetHeight ?? 520;

    // Evitar que el panel se salga por arriba o por abajo.
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
      updateMenuPosition();
    }

    setOpen((previous) => !previous);
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
        setOpen(false);
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
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Actualizar la posición después de montar el panel
  // y cuando cambie el viewport o haya desplazamiento.
  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    const handleViewportChange = () => {
      if (
        buttonRef.current &&
        !buttonRef.current.getClientRects().length
      ) {
        setOpen(false);
        return;
      }

      updateMenuPosition();
    };

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

  const handleClick = (link: string) => {
    setOpen(false);
    navigate(link);
  };

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
      {/* Botón ubicado en el navbar */}
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

      {/* Portal: el panel se renderiza fuera del AppBar */}
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
                  flex flex-col
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
                    h-px bg-gradient-to-r
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

                {/* Encabezado fijo */}
                <div className="relative flex shrink-0 items-center justify-between px-5 pb-4 pt-5">
                  <div>
                    <h2 className="text-[15px] font-semibold tracking-tight text-white">
                      Aplicaciones
                    </h2>

                    <p className="mt-1 text-xs text-blue-100/55">
                      Tus herramientas de trabajo
                    </p>
                  </div>

                  <div
                    className="
                      flex size-9 items-center justify-center
                      rounded-xl border border-white/15
                      bg-white/[0.08] text-blue-100/90
                    "
                  >
                    <AppsIcon sx={{ fontSize: 19 }} />
                  </div>
                </div>

                <div className="mx-5 h-px shrink-0 bg-white/10" />

                {/* Lista desplazable de aplicaciones */}
                <motion.div
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
                    overflow-y-auto
                    overscroll-contain
                  "
                >
                  {filteredMenuItems.map((app) => (
                    <motion.button
                      key={app.link}
                      type="button"
                      variants={itemVariants}
                      onClick={() => handleClick(app.link)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      aria-label={`Abrir ${app.label}`}
                      className="
                        group flex min-h-[100px] min-w-0
                        flex-col items-center justify-center
                        gap-2 rounded-2xl px-2 py-3
                        text-center
                        transition-colors duration-200
                        hover:bg-white/[0.09]
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-blue-300
                      "
                    >
                      {/* Icono de la aplicación */}
                      <span
                        className="
                          flex size-12 shrink-0
                          items-center justify-center
                          transition-transform duration-200
                          group-hover:scale-110
                        "
                      >
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
                    </motion.button>
                  ))}

                  {filteredMenuItems.length === 0 && (
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
                    onPress={() => handleClick('/menu')}
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
