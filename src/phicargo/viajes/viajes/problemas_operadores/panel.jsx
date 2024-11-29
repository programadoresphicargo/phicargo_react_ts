import React, { useState, useEffect, } from 'react';
import Drawer from '@mui/material/Drawer';
import { CircularProgress } from "@nextui-org/progress";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ReporteOperador from './reporte';

export default function ProblemasOperadores({ open, toggleDrawer }) {

    const [id_reporte, setIDReporte] = React.useState("");
    const [estatus, setEstatus] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);

    useEffect(() => {
        getEstatus();
    }, [open]);

    const getEstatus = async () => {

        try {
            setLoading(true);
            const response = await fetch('/phicargo/viajes/problemas_operadores/getProblemas.php', {
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

    const [openReporte, setOpenReporte] = React.useState(false);

    const handleClickOpen = (id_reporte) => {
        setOpenReporte(true);
        setIDReporte(id_reporte)
    };

    const handleCloseReporte = () => {
        setOpenReporte(false);
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
                            Problemas operador
                        </div>
                    </Toolbar>
                </AppBar>

                <ul class="list-group list-group-flush navbar-card-list-group">

                    {isLoading && (
                        <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                            <CircularProgress size="lg" aria-label="Loading..." color='danger' />
                        </div>
                    )}

                    {estatus.map((step, index) => (
                        <li class="list-group-item form-check-select" onClick={() => handleClickOpen(step.id_reporte)}>
                            <div class="row">
                                <div class="col-auto">
                                    <div class="d-flex align-items-center">
                                        <label class="form-check-label" for="notificationCheck6"></label>
                                        <span class="form-check-stretched-bg"></span>
                                        <div class="avatar avatar-sm avatar-soft-dark avatar-circle">
                                            <span class="avatar-initials">A</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="col ms-n2">
                                    <h5 class="mb-1">{step.referencia}</h5>
                                    <p class="text-body fs-5">{step.nombre_operador}</p>
                                </div>

                                <small class="col-auto text-muted text-cap">{step.fecha_creacion}</small>
                            </div>

                        </li>
                    ))}
                </ul>

                <ReporteOperador id_reporte={id_reporte} open={openReporte} onClose={handleCloseReporte}></ReporteOperador>

            </Drawer>
        </div>
    );
}
