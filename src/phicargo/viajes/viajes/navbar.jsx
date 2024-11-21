import React, { useState, useEffect, useMemo, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Notificaciones from './panel_notificaciones/panel';
import ProblemasOperadores from './problemas_operadores/panel';

const pages = [
    { name: 'ACTIVOS', path: '/viajes' },
    { name: 'FINALIZADOS', path: '/viajesfinalizados' },
    { name: 'PROGRAMACIÓN DE VIAJES', path: '/viajesprogramados' },
    { name: 'PODS', path: '/viajes' },
];

function NavbarViajes() {


    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };


    const [openPanelNotificaciones, setPanelNotificaciones] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setPanelNotificaciones(newOpen);
    };

    const [openPanelPO, setPanelPO] = React.useState(false);

    const toggleDrawer2 = (newOpen) => () => {
        setPanelPO(newOpen);
    };

    const handleBackClick = () => {
        window.location.href = "https://phides.phicargo-sistemas.online/phicargo/menu/principal/index.php";
    };

    return (
        <>
            <AppBar elevation={0} position="static">
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
                            <ArrowBackIcon />
                        </IconButton>

                        <img className='m-2'
                            src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
                            alt="Descripción de la imagen"
                            style={{
                                width: '175px',
                                height: '60px',
                                filter: 'brightness(0) invert(1)' // Esto hará que la imagen sea blanca
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
                                        <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Typography sx={{ textAlign: 'center', color: 'white' }}>{name}</Typography>
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
                                    sx={{ my: 2, color: 'black', display: 'block' }}
                                    component={Link}
                                    to={path}
                                >
                                    {name}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <IconButton
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit"
                                onClick={toggleDrawer2(true)}
                            >
                                <Badge badgeContent={1} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            <IconButton
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit"
                                onClick={toggleDrawer(true)}
                            >
                                <Badge badgeContent={1} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Box>

                    </Toolbar>
                </Container>
            </AppBar>

            <Notificaciones open={openPanelNotificaciones} toggleDrawer={toggleDrawer}></Notificaciones>
            <ProblemasOperadores open={openPanelPO} toggleDrawer={toggleDrawer2}></ProblemasOperadores>
        </>
    );
}

export default NavbarViajes;
