import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MonitoreoNavbar() {

    const handleBackClick = () => {
        window.location.href = "https://phides.phicargo-sistemas.online/phicargo/menu/principal/index.php"; 
    };

    return (
        <AppBar position="static" elevation={0}>
            <Container maxWidth="xxl">
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

                    {/* Logo de la empresa */}
                    <img
                        src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
                        alt="Descripción de la imagen"
                        style={{
                            width: '130px',
                            height: '45px',
                            filter: 'brightness(0) invert(1)' // Esto hará que la imagen sea blanca
                        }}
                    />
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default MonitoreoNavbar;
