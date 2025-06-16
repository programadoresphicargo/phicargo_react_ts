import accesos_img from '../assets/menu/accesos.png';
import bonos_img from '../assets/menu/bonos.png';
import calendar3d from '../assets/menu/calendar3d.png';
import ce_img from '../assets/menu/costos_extras.png';
import dashboardIcon from '../assets/menu/dashboardIcon.png';
import maniobras_img from '../assets/menu/maniobras.png';
import monitoreo_img from '../assets/menu/monitoreo.png';
import complaints from '../assets/menu/complaints.png';
import incidentsImg from '../assets/menu/incidents.png';
import reportesImg from '../assets/menu/reportes.png';
import shipingcontainer from '../assets/menu/shiping-container.png';
import turnos_img from '../assets/menu/turnos.png';
import usuarios_img from '../assets/menu/usuarios.png';
import viajes_img from '../assets/menu/viajes.png';
import logo from '../assets/img/phicargo-vertical.png';
import almacen from '../assets/menu/almacen.png';
import Toolbar from '@mui/material/Toolbar';
import AvatarProfile from '@/components/ui/AvatarProfile';
import AppBar from '@mui/material/AppBar';
import { Grid } from '@mui/system';
import { useAuthContext } from '@/modules/auth/hooks';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'

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
    label: 'Control de viajes',
    link: '/viajes',
    requiredPermissions: [1],
  },
  {
    icon: maniobras_img,
    label: 'Maniobras',
    link: '/cartas-porte',
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
    icon: incidentsImg,
    label: 'Incidencias',
    link: '/incidencias',
    requiredPermissions: [214],
  },
];

const MainMenuPage = () => {
  const { session } = useAuthContext();

  const filteredMenuItems = useMemo(
    () =>
      menuItems.filter((item) =>
        item.requiredPermissions.every((permission) =>
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
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
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
        className="flex items-center justify-center mb-8 sm:mb-12 px-4 relative z-10"
        style={{ minHeight: '30vh' }}
      >
        <div className="flex justify-center items-center">
          <img
            src={logo}
            alt="Logo Phi Cargo"
            className="w-72 sm:w-60 md:w-80 lg:w-[400px] h-auto object-contain"
          />
        </div>
      </div>
      <div className="">
        <div className="">
          <div className="">
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
          </div>
        </div>
      </div>
    </main >
  );
};

export default MainMenuPage;

interface MenuItemProps {
  icon: string;
  label: string;
  link: string;
  isExternal?: boolean;
}

const MenuItem = ({ icon, label, link, isExternal = false }: MenuItemProps) => {
  const navigate = useNavigate();
  const { session } = useAuthContext();

  const handleClick = () => {
    if (isExternal) {
      // Crear un formulario dinámico
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = link;
      form.target = '_blank';

      // Añadir una variable al formulario
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'id_usuario'; // Nombre del campo que deseas enviar
      input.value = String(session?.user.id); // Valor de la variable
      form.appendChild(input);

      // Enviar el formulario
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } else {
      navigate(link);
    }
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
        rounded-2xl
        bg-white
        shadow-md
        cursor-pointer
        transition-colors
        duration-200
        hover:bg-gray-100
      "
    >
      <div className="mb-2.5">
        <img src={icon} alt={label} className="w-20 h-20 mb-1.5" />
      </div>
      <div className="text-xs font-bold text-center">{label}</div>
    </div>
  );
};

