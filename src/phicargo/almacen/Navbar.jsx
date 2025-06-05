import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import AppsIcon from '@mui/icons-material/Apps';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import logo from '../../assets/img/phicargo-vertical.png';

const pages = [
    { name: 'SOLICITUDES EPP', path: '/Almacen' },
    { name: 'PRODUCTOS', path: '/EPP' },
];

function NavbarAlmacen() {

    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleBackClick = () => {
        navigate("/menu");
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar
            elevation={0}
            position="static"
            sx={{
                background: 'linear-gradient(90deg, #0b2149, #002887)',
                padding: '0 16px',
            }}>
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

                    <img className='m-2'
                        src={logo}
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
                                        <Typography sx={{ textAlign: 'center', color: 'black' }}>{name}</Typography>
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
                                    my: 2, color: 'white', display: 'block', fontFamily: 'inter', '&:hover': {
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

                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavbarAlmacen;
