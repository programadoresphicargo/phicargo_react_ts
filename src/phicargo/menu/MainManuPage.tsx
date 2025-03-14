import { useEffect, useMemo } from 'react';

import AppBar from '@mui/material/AppBar';
import AvatarProfile from '../modules/core/components/ui/AvatarProfile';
import { Grid } from '@mui/system';
import MenuItem from './MenuItem';
import Toolbar from '@mui/material/Toolbar';
import accesos_img from '../../assets/menu/accesos.png';
import bonos_img from '../../assets/menu/bonos.png';
import calendar3d from '../../assets/menu/calendar3d.png';
import ce_img from '../../assets/menu/costos_extras.png';
import correo_img from '../../assets/menu/correo.png';
import dashboardIcon from '../../assets/menu/dashboardIcon.png';
import maniobras_img from '../../assets/menu/maniobras.png';
import monitoreo_img from '../../assets/menu/monitoreo.png';
// import operadores_img from '../../assets/menu/operadores.png';
import reportesImg from '../../assets/menu/reportes.png';
import shipingcontainer from '../../assets/menu/shiping-container.png';
import turnos_img from '../../assets/menu/turnos.png';
import { useAuthContext } from '../modules/auth/hooks';
import usuarios_img from '../../assets/menu/usuarios.png';
import viajes_img from '../../assets/menu/viajes.png';

const { VITE_PHIDES_API_URL } = import.meta.env;

type MenuItemType = {
  icon: string;
  label: string;
  link: string;
  requiredPermissions: number[];
  isExternal?: boolean;
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
    icon: correo_img,
    label: 'Correos electronicos',
    link: '/CorreosElectronicos',
    requiredPermissions: [103],
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
    label: 'Solicitudes de Servicio',
    link: '/solicitudes-servicio',
    requiredPermissions: [204],
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

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          VITE_PHIDES_API_URL + '/login/inicio/get_user.php',
          {
            credentials: 'include',
          },
        );
        const data = await response.json();
        if (data.status !== 'success') {
          console.error(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    const timeoutId = setTimeout(() => {
      checkSession();
      const intervalId = setInterval(checkSession, 60000);
      return () => clearInterval(intervalId);
    }, 60000); // 60000 ms = 1 minuto

    return () => clearTimeout(timeoutId);
  }, []);

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
            src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
            alt="Logo Phi Cargo"
            className="w-72 sm:w-60 md:w-80 lg:w-[400px] h-auto object-contain"
          />
        </div>
      </div>
      <div className="flex-grow flex items-center relative lg:mx-12 z-10 -mt-10 sm:-mt-14 md:-mt-20">
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5">
            {filteredMenuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                link={item.link}
                isExternal={item.isExternal}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainMenuPage;

