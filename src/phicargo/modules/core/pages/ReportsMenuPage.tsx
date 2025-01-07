import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AvatarProfile from '../components/ui/AvatarProfile';
import { Button } from '@nextui-org/react';
import ReportMenuItem from '../components/ui/ReportMenuItem';
import balanceIcon from '../../../../assets/menu/balanceIcon.png';
import dailyOpIcon from '../../../../assets/menu/dailyOpIcon.png';
import reportIcon from '../../../../assets/menu/reportes.png';
import maintenanceIcon from '../../../../assets/menu/maintenanceIcon.png';
import clockIcon from '../../../../assets/menu/clock.png';
import phoneIcon from '../../../../assets/menu/app.png';
import { useAuthContext } from '../../auth/hooks';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type MenuItemType = {
  icon: string;
  label: string;
  path: string;
  requiredPermissions: number[];
};

const reports: MenuItemType[] = [
  {
    label: 'Reporte gerencial',
    path: '/reportes/saldos/',
    icon: reportIcon,
    requiredPermissions: [],
  },
  {
    label: 'Mantenimiento',
    path: '/reportes/mantenimiento',
    icon: maintenanceIcon,
    requiredPermissions: [198],
  },
  {
    label: 'Balance',
    path: '/reportes/balance',
    icon: balanceIcon,
    requiredPermissions: [197],
  },
  {
    label: 'Operaciones Diarias',
    path: '/reportes/operaciones',
    icon: dailyOpIcon,
    requiredPermissions: [201],
  },
  {
    label: 'Tiempos de salidas y llegadas',
    path: '/detenciones',
    icon: clockIcon,
    requiredPermissions: [],
  },
  {
    label: 'Cumplimiento estatus',
    path: '/cumplimiento',
    icon: phoneIcon,
    requiredPermissions: [],
  },
];

const ReportsMenuPage = () => {
  const navigate = useNavigate();

  const { session } = useAuthContext();

  const filteredMenuItems = useMemo(
    () =>
      reports.filter((item) =>
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
      <div className="flex mt-10 items-center mb-8 sm:mb-12 px-4 relative z-10">
        <div className="mr-auto">
          <Button
            isIconOnly
            aria-label="back"
            onPress={() => navigate('/menu')}
            className="bg-gray-100 rounded-full p-2 shadow-md hover:bg-gray-200 transition"
          >
            <ArrowBackIcon />
          </Button>
        </div>
        <div className="flex-grow flex justify-center items-center">
          <h1 className="mx-auto text-4xl sm:text-5xl font-bold text-gray-800">
            Reportes
          </h1>
        </div>
        <div className="ml-auto">
          <AvatarProfile />
        </div>
      </div>

      <div className="flex-grow flex items-center relative lg:mx-12 z-10 -mt-10 sm:-mt-14 md:-mt-20">
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
            {filteredMenuItems.map((item, index) => (
              <ReportMenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                path={item.path}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsMenuPage;

