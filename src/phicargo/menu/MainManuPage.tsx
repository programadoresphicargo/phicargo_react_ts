import AvatarProfile from '../modules/core/components/ui/AvatarProfile';
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
    link: '/terminales',
    requiredPermissions: [8],
  },
  {
    icon: viajes_img,
    label: 'Control de viajes',
    link: '/viajes',
    requiredPermissions: [1, 101, 102],
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
    link: '/monitoreo',
    requiredPermissions: [40],
  },
  {
    icon: accesos_img,
    label: 'Accesos',
    link: '/accesos',
    requiredPermissions: [126],
  },
  { icon: bonos_img, label: 'Bonos', link: '/bonos', requiredPermissions: [3] },
  {
    icon: usuarios_img,
    label: 'Usuarios',
    link: '/control-usuarios',
    requiredPermissions: [5],
  },
  {
    icon: operadores_img,
    label: 'Operadores',
    link: '/controloperadores',
    requiredPermissions: [7],
  },
  {
    icon: viajes_img,
    label: 'Disponibilidad',
    link: '/disponibilidad',
    requiredPermissions: [200],
  },
  {
    icon: correo_img,
    label: 'Correos electronicos',
    link: '/CorreosElectronicos',
    requiredPermissions: [],
  },
  {
    icon: reportesImg,
    label: 'Reportes',
    link: '/reportes',
    requiredPermissions: [4],
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

  return (
    <div
      className="min-h-screen bg-gray-100 p-4 flex flex-col justify-between relative"
      style={{
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
      }}
    >
      <div className="flex items-center mb-8 sm:mb-12 px-4 relative z-10">
        <div className="flex-grow flex justify-center items-center">
          <img
            src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
            alt="Logo Phi Cargo"
            className="w-40 sm:w-60 md:w-80 lg:w-[400px] h-auto object-contain"
          />
        </div>

        <div className="ml-auto">
          <AvatarProfile />
        </div>
      </div>

      <div className="flex-grow flex items-center relative lg:mx-12 z-10 -mt-10 sm:-mt-14 md:-mt-20">
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
            {filteredMenuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                link={item.link}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenuPage;

