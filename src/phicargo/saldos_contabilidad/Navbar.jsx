import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppsIcon from '@mui/icons-material/Apps';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/phicargo-vertical.png';

function ResponsiveAppBar() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/menu');
    };

    return (
        <AppBar elevation={0}
            position="static"
            sx={{
                background: 'linear-gradient(90deg, #0b2149, #002887)',
                padding: '0 16px',
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
                        <AppsIcon />
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
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
