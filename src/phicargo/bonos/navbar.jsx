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
import { Link, useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Badge from '@mui/material/Badge';
import AppsIcon from '@mui/icons-material/Apps';

function NavbarBonos() {

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/menu");
    };

    return (
        <>
            <AppBar elevation={0} position="static" sx={{ backgroundColor: '#353535' }}>
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
                                filter: 'brightness(0) invert(1)' // Esto hará que la imagen sea blanca
                            }}
                        />

                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}

export default NavbarBonos;
