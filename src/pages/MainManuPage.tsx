
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import logo from '../assets/img/phicargo_logo_white.png';
import fondo2 from '../assets/img/tract_scannia.jpg';

import AvatarProfile from '@/components/ui/AvatarProfile';
import { useAuthContext } from '@/modules/auth/hooks';
import { menuItems } from '../pages/MenuItems';

const MainMenuPage = () => {
  const { session } = useAuthContext();
  const permissions = session?.user?.permissions;

  const filteredMenuItems = useMemo(
    () =>
      menuItems.filter((item) =>
        item.requiredPermissions.some((permission) =>
          permissions?.includes(permission),
        ),
      ),
    [permissions],
  );

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
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
            rgba(7, 24, 55, 0.96) 0%,
            rgba(0, 40, 135, 0.80) 48%,
            rgba(0, 40, 135, 0.76) 100%
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
        className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full bg-blue-500/10 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-40 size-[450px] rounded-full bg-cyan-400/[0.07] blur-[120px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-10 sm:px-8 lg:px-12">
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
                MENU PRINCIPAL
              </p>
            </div>
          </div>

          <div>
            <AvatarProfile />
          </div>
        </header>

        {/* Logotipo */}
        <section className="flex justify-center py-10 text-center sm:py-14">
          <motion.img
            src={logo}
            alt="Phi Cargo"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1.3 }}
            transition={{ duration: 0.55 }}
            className="mb-8 h-auto w-52 object-contain drop-shadow-2xl sm:w-60 md:w-64"
          />
        </section>

        {/* Accesos */}
        <motion.section
          aria-label="Módulos del sistema"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
        >
          {filteredMenuItems.map((item) => (
            <motion.div
              key={item.link}
              variants={itemVariants}
              className="min-w-0"
            >
              <MenuItem
                icon={item.icon}
                label={item.label}
                link={item.link}
              />
            </motion.div>
          ))}
        </motion.section>

        {/* Pie de página */}
        <footer className="mt-12 flex flex-col items-center gap-2 border-t border-white/10 pt-6 text-center">
          <p className="text-[10px] font-medium tracking-[0.2em] text-white/50">
            PHI CARGO
          </p>
          <p className="text-[10px] text-blue-100/40">
            2026
          </p>
        </footer>
      </div>
    </main>
  );
};

interface MenuItemProps {
  icon: string;
  label: string;
  link: string;
}

const MenuItem = ({ icon, label, link }: MenuItemProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      type="button"
      onClick={() => navigate(link)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      aria-label={`Abrir módulo ${label}`}
      className="
        group flex min-h-[140px] w-full flex-col
        items-center justify-center gap-3 rounded-2xl
        border border-white/15 bg-white/[0.12] p-4
        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        backdrop-blur-xl
        transition-[background-color,border-color,box-shadow] duration-300
        hover:border-white/30 hover:bg-white/20
        hover:shadow-[0_12px_36px_rgba(0,0,0,0.18)]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-blue-300
        sm:min-h-[155px] sm:gap-4 sm:rounded-3xl
      "
    >
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="size-14 object-contain transition-transform duration-200 group-hover:scale-105 sm:size-16"
      />

      <span className="text-center text-sm font-semibold leading-5 sm:text-[15px]">
        {label}
      </span>
    </motion.button>
  );
};

export default MainMenuPage;
