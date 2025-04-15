import { Link, useNavigate } from 'react-router-dom';
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

const pages = [
  { name: 'ACTIVOS', path: '/viajes' },
  { name: 'FINALIZADOS', path: '/viajesfinalizados' },
  { name: 'PROGRAMACIÓN', path: '/viajesprogramados' },
  { name: 'CONTROL ESTATUS', path: '/controlestatus' },
  { name: 'ESTADIAS', path: '/estadias' },
  { name: 'ENVIO MASIVO', path: '/envio_masivo_viajes' },
  { name: 'CUMPLIMIENTO ESTATUS', path: '/cumplimiento_estatus_ejecutivos' },
];

function NavbarViajes() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenPO,
    onOpen: onOpenPO,
    onOpenChange: onOpenChangePO,
  } = useDisclosure();

  const handleBackClick = () => {
    navigate('/menu');
  };

  const { getReportesNoAtendidos } = useJourneyDialogs();
  const [numProblemasOperador, setNumPO] = useState(0);

  const fetchReportes = async () => {
    const numReportes = await getReportesNoAtendidos();
    setNumPO(numReportes);
  };

  useEffect(() => {
    fetchReportes();
  });

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
      <AppBar
        elevation={3}
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #0b2149, #002887)',
          padding: '0 16px',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Botón de retroceso */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={handleBackClick}
              sx={{ mr: 2 }}
            >
              <AppsIcon></AppsIcon>
            </IconButton>

            <img
              className="m-2"
              src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
              alt="Descripción de la imagen"
              style={{
                width: '175px',
                height: '60px',
                filter: 'brightness(0) invert(1)',
              }}
            />

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map(({ name, path }) => (
                  <MenuItem key={name} onClick={handleCloseNavMenu}>
                    <Link
                      to={path}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Typography sx={{ textAlign: 'center', color: 'black' }}>
                        {name}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map(({ name, path }) => (
                <Button
                  key={name}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    fontFamily: 'inter',
                    '&:hover': {
                      color: 'white', // Cambia el color del texto al pasar el cursor
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', // Opcional: cambia el fondo
                    },
                  }}
                  component={Link}
                  to={path}
                >
                  {name}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
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

              <MotumAlertsPanel />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

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

export default NavbarViajes;

