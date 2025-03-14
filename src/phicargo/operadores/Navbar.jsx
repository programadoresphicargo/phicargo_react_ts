import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function ResponsiveAppBar() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/menu');
    };

    return (
        <AppBar position="static"
            sx={{
                background: 'linear-gradient(90deg, #0b2149, #002887)',
                padding: '0 16px'
            }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>

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
                            width: '170px',
                            height: '60px',
                            filter: 'brightness(0) invert(1)' // Esto hará que la imagen sea blanca
                        }}
                    />
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
