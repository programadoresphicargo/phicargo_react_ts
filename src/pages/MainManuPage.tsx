import accesos_img from '../assets/menu/accesos.png';
import bonos_img from '../assets/menu/bonos.png';
import calendar3d from '../assets/menu/calendar3d.png';
import ce_img from '../assets/menu/costos_extras.png';
import dashboardIcon from '../assets/menu/dashboardIcon.png';
import maniobras_img from '../assets/menu/maniobras.png';
import monitoreo_img from '../assets/menu/monitoreo.png';
import complaints from '../assets/menu/complaints.png';
import minutas from '../assets/menu/minutas.png';
import incidentsImg from '../assets/menu/incidents.png';
import reportesImg from '../assets/menu/reportes.png';
import shipingcontainer from '../assets/menu/shiping-container.png';
import turnos_img from '../assets/menu/turnos.png';
import usuarios_img from '../assets/menu/usuarios.png';
import viajes_img from '../assets/menu/viajes.png';
import logo from '../assets/img/phicargo_logo_white.png';
import almacen from '../assets/menu/almacen.png';
import Toolbar from '@mui/material/Toolbar';
import AvatarProfile from '@/components/ui/AvatarProfile';
import AppBar from '@mui/material/AppBar';
import { Grid } from '@mui/system';
import { useAuthContext } from '@/modules/auth/hooks';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import fondo2 from '../assets/img/tract_scannia.jpg';
import chatbot from '../assets/menu/chatbot.png';
import ti from '../assets/menu/laptop.png';

type MenuItemType = {
  icon: string;
  label: string;
  link: string;
  requiredPermissions: number[];
};

const menuItems: MenuItemType[] = [
  {
    icon: turnos_img,
    label: 'Turnos',
    requiredPermissions: [202],
    link: '/turnos',
  },
  {
    icon: viajes_img,
    label: 'Viajes',
    link: '/viajes',
    requiredPermissions: [1],
  },
  {
    icon: maniobras_img,
    label: 'Maniobras',
    link: '/control_maniobras',
    requiredPermissions: [38],
  },
  {
    icon: monitoreo_img,
    label: 'Monitoreo',
    link: '/EventosPendientes',
    requiredPermissions: [40],
  },
  {
    icon: accesos_img,
    label: 'Accesos',
    link: '/accesos',
    requiredPermissions: [126],
  },
  {
    icon: bonos_img,
    label: 'Bonos',
    requiredPermissions: [3],
    link: '/bonos',
  },
  {
    icon: usuarios_img,
    label: 'Usuarios',
    link: '/control-usuarios',
    requiredPermissions: [5],
  },
  {
    icon: viajes_img,
    label: 'Operadores y Unidades',
    link: '/disponibilidad',
    requiredPermissions: [200],
  },
  {
    icon: reportesImg,
    label: 'Reportes',
    link: '/reportes',
    requiredPermissions: [4],
  },
  {
    icon: ce_img,
    label: 'Costos extras',
    link: '/folios_costos_extras',
    requiredPermissions: [130],
  },
  {
    icon: dashboardIcon,
    label: 'Dashboard',
    link: '/dashboards',
    requiredPermissions: [203],
  },
  {
    label: 'Disponibilidad',
    link: '/operaciones-diarias',
    icon: calendar3d,
    requiredPermissions: [201],
  },
  {
    icon: shipingcontainer,
    label: 'Servicios',
    link: '/servicios',
    requiredPermissions: [204],
  },
  {
    icon: almacen,
    label: 'Almacen',
    link: '/solicitudes_epp',
    requiredPermissions: [300],
  },
  {
    icon: complaints,
    label: 'Quejas',
    link: '/quejas',
    requiredPermissions: [213],
  },
  {
    icon: minutas,
    label: 'Minutas',
    link: '/minutas',
    requiredPermissions: [782],
  },
  {
    icon: incidentsImg,
    label: 'Incidencias',
    link: '/incidencias',
    requiredPermissions: [214, 215, 216, 217],
  },
  {
    icon: chatbot,
    label: 'Chat',
    link: '/chatbot',
    requiredPermissions: [700],
  },
  {
    icon: ti,
    label: 'Sistemas',
    link: '/celulares',
    requiredPermissions: [701],
  },
];

const MainMenuPage = () => {
  const { session } = useAuthContext();

  const filteredMenuItems = useMemo(
    () =>
      menuItems.filter((item) =>
        item.requiredPermissions.some((permission) =>
          session?.user?.permissions?.includes(permission),
        ),
      ),
    [session],
  );

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.05, // tiempo entre cada item (en segundos)
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <main
      style={{
        backgroundImage: `
        linear-gradient(90deg, rgba(11, 33, 73, 0.95), rgba(0, 40, 135, 0.95)),
        url(${fondo2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <AppBar
        position="static"
        style={{
          backgroundColor: 'transparent',
          padding: '0',
          boxShadow: 'none',
        }}
        elevation={0}
      >
        <Toolbar>
          <Grid sx={{ flexGrow: 1 }}></Grid>
          <AvatarProfile />
        </Toolbar>
      </AppBar>
      <div
        className="flex items-center justify-center"
        style={{ minHeight: '25vh' }}
      >
        <div className="flex justify-center items-center">
          <img
            src={logo}
            alt="Logo Phi Cargo"
            className="w-72 sm:w-60 md:w-80 lg:w-[350px] h-auto object-contain"
          />
        </div>
      </div>

      <motion.div
        className="grid-container"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {filteredMenuItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            style={{
              padding: "10px",
              borderRadius: "20px",
              display: "flex",             // ✅ Activa flex
              justifyContent: "center",    // ✅ Centra horizontalmente
              alignItems: "center",        // ✅ Centra verticalmente
            }}
          >
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              link={item.link}
            />
          </motion.div>
        ))}
      </motion.div>

    </main >
  );
};

export default MainMenuPage;

interface MenuItemProps {
  icon: string;
  label: string;
  link: string;
}

const MenuItem = ({ icon, label, link, }: MenuItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <div
      onClick={handleClick}
      className="
      flex
      flex-col
      items-center
      justify-center
      w-32
      h-32
      rounded-3xl
      bg-white/10
      shadow-xl
      backdrop-blur-lg
      border
      border-white/10
      cursor-pointer
      transition
      duration-300
      hover:bg-white/20
      hover:shadow-2xl
    "
    >
      <div className="mb-2.5">
        <img src={icon} alt={label} className="w-20 h-20 mb-1.5" />
      </div>
      <div className="text-xs font-bold text-white text-center">{label}</div>
    </div>
  );
};

