import { Link } from 'react-router-dom';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from '@heroui/react';
import AppBar from '@mui/material/AppBar';
import AppsIcon from '@mui/icons-material/Apps';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import MailIcon from '@mui/icons-material/Mail';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MotumAlertsPanel } from '@/modules/vehicles/components/motum-events/MotumAlertsPanel';
import Notificaciones from './panel_notificaciones/panel';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ProblemasOperadores from './problemas_operadores/panel';
import ProblemasOperadores2 from './problemas_operadores/panel';
import ReportIcon from '@mui/icons-material/Report';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import odooApi from '@/api/odoo-api';
import { useDisclosure } from '@heroui/react';
import { useJourneyDialogs } from './seguimiento/funciones';
import logo from '../../assets/img/phicargo-vertical.png';
import { useAuthContext } from '@/modules/auth/hooks';
import AvatarProfile from '@/components/ui/AvatarProfile';
import Slide from "@mui/material/Slide";
import { ViajeContext } from './context/viajeContext';
import CustomNavbar from '@/pages/CustomNavbar';
import { pages } from '../viajes/pages';

function NavbarTravel() {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenPO,
    onOpen: onOpenPO,
    onOpenChange: onOpenChangePO,
  } = useDisclosure();

  const { getReportesNoAtendidos } = useJourneyDialogs();
  const [numProblemasOperador, setNumPO] = useState(0);

  const fetchReportes = async () => {
    const numReportes = await getReportesNoAtendidos();
    setNumPO(numReportes);
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  return (
    <>
      {numProblemasOperador > 0 && (
        <Alert
          color="danger"
          variant="solid"
          title="Atención: Existen problemas de operadores pendientes de atención."
          description={`${numProblemasOperador} reportes pendientes de atención`}
          radius="none"
        />
      )}
      <CustomNavbar
        pages={pages}
        extraButtons={
          <>
            <IconButton size="large" color="inherit" onClick={onOpenPO}>
              <Badge badgeContent={numProblemasOperador} color="error">
                <ReportIcon />
              </Badge>
            </IconButton>

            <IconButton size="large" color="inherit" onClick={onOpen}>
              <Badge badgeContent={1} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <MotumAlertsPanel />
            </Box>
          </>}
      >
      </CustomNavbar>

      <Notificaciones
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      ></Notificaciones>

      <ProblemasOperadores2
        isOpen={isOpenPO}
        onOpenChange={onOpenChangePO}
      ></ProblemasOperadores2>

    </>
  );
}

export default NavbarTravel;

