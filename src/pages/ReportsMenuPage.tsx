import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AvatarProfile from '@/components/ui/AvatarProfile';
import { Button } from '@heroui/react';
import ReportMenuItem from '@/components/ui/ReportMenuItem';
import balanceIcon from '../assets/menu/balanceIcon.png';
import clockIcon from '../assets/menu/clock.png';
import detencionesIcon from '../assets/menu/detenciones.png';
import estadiasIcon from '../assets/menu/estadias.png';
import maintenanceIcon from '../assets/menu/maintenanceIcon.png';
import phoneIcon from '../assets/menu/app.png';
import reportIcon from '../assets/menu/reportes.png';
import revenueIcon from '../assets/menu/revenue.png';
import { useAuthContext } from '@/modules/auth/hooks';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import fondo2 from '../assets/img/tract_scannia.jpg';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Grid } from '@mui/system';
import logo from '../assets/img/phicargo_logo_white.png';
import { motion } from 'framer-motion';

type MenuItemType = {
  icon: string;
  label: string;
  path: string;
  requiredPermissions: number[];
};

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

const reports: MenuItemType[] = [
  {
    label: 'Reporte gerencial',
    path: '/reportes/saldos/',
    icon: reportIcon,
    requiredPermissions: [190],
  },
  {
    label: 'Mantenimiento',
    path: '/reportes/mantenimiento',
    icon: maintenanceIcon,
    requiredPermissions: [198],
  },
  {
    label: 'Proyección',
    path: '/reportes/proyeccion',
    icon: revenueIcon,
    requiredPermissions: [207],
  },
  {
    label: 'Balance',
    path: '/reportes/balance',
    icon: balanceIcon,
    requiredPermissions: [197],
  },
  {
    label: 'Tiempos de salidas y llegadas',
    path: '/detenciones',
    icon: clockIcon,
    requiredPermissions: [209],
  },
  {
    label: 'Cumplimiento estatus',
    path: '/cumplimiento',
    icon: phoneIcon,
    requiredPermissions: [210],
  },
  {
    label: 'Reporte de estadias',
    path: '/estadias',
    icon: estadiasIcon,
    requiredPermissions: [211],
  },
  {
    label: 'Reporte de detenciones',
    path: '/reporte_detenciones',
    icon: detencionesIcon,
    requiredPermissions: [0],
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
          <Button
            isIconOnly
            aria-label="back"
            size="sm"
            onPress={() => navigate('/menu')}
            className="bg-gray-100 rounded-full p-2 shadow-md hover:bg-gray-200 transition"
          >
            <ArrowBackIcon />
          </Button>
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
            <ReportMenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              path={item.path}
            />
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
};

export default ReportsMenuPage;

