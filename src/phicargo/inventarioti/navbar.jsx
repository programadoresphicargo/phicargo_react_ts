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
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportIcon from '@mui/icons-material/Report';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import odooApi from '@/api/odoo-api';
import { useDisclosure } from '@heroui/react';
import logo from '../../assets/img/phicargo-vertical.png';
import { useAuthContext } from '@/modules/auth/hooks';
import AvatarProfile from '@/components/ui/AvatarProfile';

const pages = [
  {
    name: 'CELULARES', permiso: 503,
    subpages: [
      { name: 'INVENTARIO', path: '/celulares' },
      { name: 'BAJAS', path: '/celulares' },
    ],
  },
  {
    name: 'PC / LAPTOS', permiso: 500,
    subpages: [
      { name: 'INVENTARIO', path: '/equipo_computo_ti' },
      { name: 'BAJAS', path: '/equipo_computo_t' },
    ],
  },
  { name: 'ASIGNACIÓN DE ACTIVOS', path: '/asignacion_activos', permiso: 500 },
  { name: 'EMPLEADOS', path: '/empleados_ti', permiso: 500 },
];

function SubMenu({ title, items }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'inter' }}
        onClick={handleOpen}
      >
        {title}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {items.map(({ name, path }) => (
          <MenuItem key={name} onClick={handleClose} component={Link} to={path}>
            {name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function NavbarInventarioTI() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { session } = useAuthContext();

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

  return (
    <>
      <AppBar
        elevation={3}
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #a10003, #002887)',
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
              src={logo}
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
              {pages.map((page) => {

                if (page.permiso && !session?.user.permissions.includes(page.permiso)) return null;

                if (page.subpages) {
                  return (
                    <SubMenu
                      key={page.name}
                      title={page.name}
                      items={page.subpages}
                    />
                  );
                }

                return (
                  <Button
                    key={page.name}
                    sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'inter' }}
                    component={Link}
                    to={page.path}
                  >
                    {page.name}
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
              <AvatarProfile></AvatarProfile>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default NavbarInventarioTI;

