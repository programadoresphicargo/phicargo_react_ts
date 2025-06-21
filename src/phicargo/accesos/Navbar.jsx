import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/phicargo-vertical.png';
import AppsIcon from '@mui/icons-material/Apps';

function ResponsiveAppBar() {

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/menu");
    };

    return (
        <AppBar position="static" elevation={0}
            sx={{
                background: 'linear-gradient(90deg, #0b2149, #002887)',
                padding: '0 16px'
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
                        <AppsIcon />
                    </IconButton>

                    {/* Logo de la empresa */}
                    <img className='m-2'
                        src={logo}
                        alt="Descripción de la imagen"
                        style={{
                            width: '140px',
                            height: '50px',
                            filter: 'brightness(0) invert(1)' // Esto hará que la imagen sea blanca
                        }}
                    />
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
