import React, { useState, useEffect, useMemo, useContext } from 'react';
import Drawer from '@mui/material/Drawer';
import { CircularProgress } from "@nextui-org/progress";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { tiempoTranscurrido } from '../../../funciones/tiempo';

export default function Notificaciones({ open, toggleDrawer }) {

    const [estatus, setEstatus] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);

    useEffect(() => {
        getEstatus();
    }, [open]);

    const getEstatus = async () => {

        try {
            setLoading(true);
            const response = await fetch('/phicargo/viajes/notificaciones/getNotificaciones.php', {
                method: 'POST',
                body: new URLSearchParams({
                }),
            })
            const jsonData = await response.json();
            setEstatus(jsonData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    return (
        <div>
            <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'
                sx={{
                    '& .MuiDrawer-paper': {
                        width: {
                            xs: 200,
                            sm: 500,
                        },
                    }
                }}>

                <AppBar position="static" elevation={0}>
                    <Toolbar>
                        <div className='h1 text-white' style={{ fontFamily: 'Inter' }}>
                            Notificaciones
                        </div>
                    </Toolbar>
                </AppBar>

                <ul class="list-group list-group-flush navbar-card-list-group">

                    {isLoading && (
                        <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                            <CircularProgress size="lg" aria-label="Loading..." />
                        </div>
                    )}

                    {estatus.map((step, index) => (
                        <li class="list-group-item form-check-select">
                            <div class="row">
                                <div class="col-auto">
                                    <div class="d-flex align-items-center">
                                        <label class="form-check-label" for="notificationCheck6"></label>
                                        <span class="form-check-stretched-bg"></span>
                                        <div class="avatar avatar-sm avatar-soft-dark avatar-circle">
                                            <span class="avatar-initials">N</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="col ms-n2">
                                    <h5 class="mb-1">{step.name}</h5>
                                    <h5 class="mb-1 text-primary">{step.titulo}</h5>
                                    <p class="text-body fs-5">{step.mensaje}</p>
                                </div>

                                <small class="col-auto text-muted text-cap">{tiempoTranscurrido(step.fecha_creacion)}</small>
                            </div>

                        </li>
                    ))}
                </ul>

            </Drawer>
        </div>
    );
}
