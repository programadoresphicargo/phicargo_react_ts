import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@nextui-org/react';
import ReportMenuItem from '../components/ui/ReportMenuItem';
import balanceIcon from '../../../../assets/menu/balanceIcon.png';
import maintenanceIcon from '../../../../assets/menu/maintenanceIcon.png';
import { useNavigate } from 'react-router-dom';

const reports = [
  {
    label: 'Mantenimiento',
    path: '/reportes/mantenimiento',
    icon: maintenanceIcon,
  },
  {
    label: 'Balance',
    path: '/reportes/balance',
    icon: balanceIcon,
  },
];

const ReportsMenuPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <div
          className="fixed top-0 left-0 right-0 bg-cover bg-no-repeat"
          style={{
            height: '32rem',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
          }}
        >
          <div className="absolute top-12 left-0 right-0 flex items-center">
            {/* Botón de retroceso */}
            <div className="absolute left-4">
              <Button
                isIconOnly
                aria-label="back"
                onClick={() => navigate('/menu')}
                className="bg-gray-100 rounded-full p-2 shadow-md hover:bg-gray-200 transition"
              >
                <ArrowBackIcon />
              </Button>
            </div>

            {/* Título centrado */}
            <h1 className="mx-auto text-4xl sm:text-5xl font-bold text-gray-800">
              Reportes
            </h1>
          </div>

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

        {/* Contenido */}
        <div className="flex justify-center items-center min-h-screen w-screen border-2 pt-32">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {reports.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center"
                  style={{ zIndex: '10000' }}
                >
                  <ReportMenuItem
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsMenuPage;

