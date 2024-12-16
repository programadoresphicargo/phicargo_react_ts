import MenuItem from './MenuItem';
import accesos_img from '../../assets/menu/accesos.png';
import bonos_img from '../../assets/menu/bonos.png';
import correo_img from '../../assets/menu/correo.png';
import maniobras_img from '../../assets/menu/maniobras.png';
import monitoreo_img from '../../assets/menu/monitoreo.png';
import operadores_img from '../../assets/menu/operadores.png';
import reportesImg from '../../assets/menu/reportes.png';
import turnos_img from '../../assets/menu/turnos.png';
import { useAuthContext } from '../modules/auth/hooks';
import { useMemo } from 'react';
import usuarios_img from '../../assets/menu/usuarios.png';
import viajes_img from '../../assets/menu/viajes.png';
import toast from 'react-hot-toast';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AvatarProfile from '../modules/core/components/ui/AvatarProfile';
const { VITE_PHIDES_API_URL } = import.meta.env;

type MenuItemType = {
  icon: string;
  label: string;
  link: string;
  requiredPermissions: number[];
  isExternal?: boolean;
}

const menuItems: MenuItemType[] = [
  { icon: turnos_img, label: 'Turnos', requiredPermissions: [8], link: VITE_PHIDES_API_URL + '/turnos/vista/index.php?sucursal=veracruz', isExternal: true },
  { icon: viajes_img, label: 'Control de viajes', link: '/viajes', requiredPermissions: [1, 101, 102] },
  { icon: maniobras_img, label: 'Maniobras', link: '/cartas-porte', requiredPermissions: [38] },
  { icon: monitoreo_img, label: 'Monitoreo', link: '/monitoreo', requiredPermissions: [40] },
  { icon: accesos_img, label: 'Accesos', link: '/accesos', requiredPermissions: [126] },
  { icon: bonos_img, label: 'Bonos',  requiredPermissions: [3], link: VITE_PHIDES_API_URL + '/bonos/vista/index.php', isExternal: true },
  { icon: usuarios_img, label: 'Usuarios', link: '/control-usuarios', requiredPermissions: [5] },
  { icon: operadores_img, label: 'Operadores', link: '/controloperadores', requiredPermissions: [7] },
  { icon: viajes_img, label: 'Disponibilidad', link: '/disponibilidad', requiredPermissions: [200] },
  {
    icon: correo_img,
    label: 'Correos electronicos',
    link: '/CorreosElectronicos',
    requiredPermissions: []
  },
  { icon: reportesImg, label: 'Reportes', link: '/reportes', requiredPermissions: [4] },
];

const MainMenuPage = () => {

  const { session, onLogout } = useAuthContext();

  const filteredMenuItems = useMemo(() => menuItems.filter((item) =>
    item.requiredPermissions.every((permission) =>
      session?.user?.permissions?.includes(permission)
    )
  ), [session]);

  const checkSession = async () => {
    try {
      const response = await axios.post(
        `${VITE_PHIDES_API_URL}/login/inicio/get_user.php`,
        { userID: session?.user.id }, // Datos enviados en el cuerpo
        {
          withCredentials: true, // Habilitar envío de cookies/sesión
          headers: {
            'Content-Type': 'application/json', // Asegurar tipo de contenido
          },
        }
      );

      const data = response.data;

      // Manejar respuesta basada en el servidor PHP
      if (data.status === "success") {
        toast.success(`Sesión activa para el usuario con ID: ${data.userID}`);
      } else {
        toast.error(data.message || "No se encontró sesión activa.");
        onLogout();
      }
    } catch (error: any) {
      // Manejo de errores
      if (error.response) {
        console.error("Error en el servidor:", error.response.data);
        toast.error(`Error en el servidor: ${error.response.data.message || "Error desconocido."}`);
      } else {
        console.error("Error en la red:", error.message);
        toast.error("Error de red: " + error.message);
      }
    }
  };

  checkSession();

  return (
    <main className="main">

      <AppBar position="absolute" elevation={0}>
        <Toolbar >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Menú principal
          </Typography>
          <AvatarProfile />
        </Toolbar>
      </AppBar>

      <div
        className="fixed top-0 left-0 right-0 bg-cover bg-no-repeat"
        style={{
          height: '32rem',
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
        }}
      >
        <div className="shape-bottom absolute inset-x-0 bottom-0">
          <svg
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 1921 273"
          >
            <polygon fill="#fff" points="0,273 1921,273 1921,0" />
          </svg>
        </div>
      </div>

      <div className="flex justify-center items-center h-screen w-screen border-2">
        <div className="container mx-auto">
          <div className="flex justify-center items-center mb-5">
            <div className="flex justify-center">
              <img
                src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
                height="400px"
                width="400px"
                alt="Logo Phi Cargo"
                className="z-[200000000]"
              />
            </div>
          </div>
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

