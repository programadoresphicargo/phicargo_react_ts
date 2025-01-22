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
import { tiempoTranscurrido } from '../../funciones/tiempo';
import { Card, CardBody, CardHeader, CardFooter } from '@nextui-org/react';
import { Avatar } from '@nextui-org/react';
import odooApi from '@/phicargo/modules/core/api/odoo-api';

export default function Notificaciones({ open, toggleDrawer }) {

    const [estatus, setEstatus] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);

    useEffect(() => {
        getEstatus();
    }, [open]);

    const getEstatus = async () => {

        try {
            setLoading(true);
            const response = await odooApi.get('/notificaciones/estatus_operadores/');
            setEstatus(response.data);
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
                        <>
                            <Card className='m-2'>
                                <CardHeader className="justify-between">
                                    <div className="flex gap-5">
                                        <Avatar
                                            isBordered
                                            radius="full"
                                            size="md"
                                            src="https://static.vecteezy.com/system/resources/previews/000/442/250/original/vector-notification-icon.jpg"
                                        />
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-small font-semibold leading-none text-default-600">{step.name}</h4>
                                            <h5 className="text-small tracking-tight text-default-400">{step.titulo}</h5>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody className="px-3 py-0 text-small text-default-400">
                                    {step.mensaje}
                                </CardBody>
                                <CardFooter className="gap-3">
                                    <div className="flex gap-1">
                                        <p className="font-semibold text-default-400 text-small">{tiempoTranscurrido(step.fecha_creacion)}</p>
                                    </div>
                                </CardFooter>
                            </Card>
                        </>
                    ))}
                </ul>

            </Drawer>
        </div>
    );
}
