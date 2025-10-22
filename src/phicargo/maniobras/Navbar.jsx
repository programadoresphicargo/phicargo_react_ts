import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Navigate } from 'react-router-dom';
import WebSocketWithToast from '../websocket/websocket';
import AppsIcon from '@mui/icons-material/Apps';
import logo from '../../assets/img/phicargo-vertical.png';
import AvatarProfile from '@/components/ui/AvatarProfile';

const pages = [
    { name: 'CONTROL DE MANIOBRAS', path: '/control_maniobras' },
    { name: 'CONTENEDORES', path: '/cartas-porte' },
    {
        name: 'NOMINAS',
        subpages: [
            { name: 'Nominas', path: '/nominas_viejas' },
            { name: 'Nominas Nueva (No entrar)', path: '/nominas' },
            { name: 'Precios', path: '/precios' },
        ],
    },
    { name: 'Terminales', path: '/terminales' },
    {
        name: 'Reportes',
        subpages: [
            { name: 'CUMPLIMIENTO ESTATUS POR HORA', path: '/cumplimiento_estatus_ejecutivos_maniobras' },
            { name: 'CUMPLIMIENTO ESTATUS POR ESTATUS', path: '/cumplimiento_estatus_maniobras' }
        ],
    },
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

function ManiobrasNavBar() {
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleBackClick = () => {
        navigate("/menu");
    };

    return (
        <>
            <AppBar
                elevation={3}
                position="static"
                sx={{
                    background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
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

export default ManiobrasNavBar;
