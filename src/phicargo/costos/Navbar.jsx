import * as React from 'react';
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

const pages = [
    { name: 'FOLIOS', path: '/folios_costos_extras' },
    { name: 'CONTROL DE COSTOS', path: '/control_maniobras' },
];

const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundImage: 'url(https://phides.phicargo-sistemas.online/phicargo/img/fondo7.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '75px',
    },
    title: {
        flexGrow: 1,
    },
}));

function ManiobrasNavBar() {
    const classes = useStyles();
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
            <AppBar position="static" elevation={0} className={classes.appBar}>
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
                            src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
                            alt="Descripción de la imagen"
                            style={{
                                width: '175px',
                                height: '60px',
                                //filter: 'brightness(0) invert(1)' // Esto hará que la imagen sea blanca
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
                                            <Typography sx={{ textAlign: 'center' }}>{name}</Typography>
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
                                    sx={{ my: 2, color: 'black', display: 'block', fontFamily: 'Inter' }}
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
        </>
    );
}

export default ManiobrasNavBar;
