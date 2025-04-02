import { Avatar, Card, CardBody, CardFooter, CardHeader, CircularProgress } from "@heroui/react";
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    useDisclosure,
} from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Travel from '../control/viaje';
import Typography from '@mui/material/Typography';
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { tiempoTranscurrido } from '../../funciones/tiempo';

export default function Notificaciones({ isOpen, onOpen, onOpenChange }) {

    const [estatus, setEstatus] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);
    const [openTravel, setOpenTravel] = React.useState(false);
    const { ActualizarIDViaje } = useContext(ViajeContext);

    const handleClickOpen = (id_viaje) => {
        ActualizarIDViaje(id_viaje);
        setOpenTravel(true);
    };

    const handleClose = () => {
        setOpenTravel(false);
    };

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
        <>
            <Travel open={openTravel} handleClose={handleClose}></Travel>
            <Drawer
                isOpen={isOpen}
                size='lg'
                motionProps={{
                    variants: {
                        enter: {
                            opacity: 1,
                            x: 0,
                            duration: 0.3,
                        },
                        exit: {
                            x: 100,
                            opacity: 0,
                            duration: 0.3,
                        },
                    },
                }}
                onOpenChange={onOpenChange}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">Notificaciones</DrawerHeader>
                            <DrawerBody>

                                <ul class="list-group list-group-flush navbar-card-list-group">

                                    {isLoading && (
                                        <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                                            <CircularProgress size="lg" aria-label="Loading..." />
                                        </div>
                                    )}

                                    {estatus.map((step, index) => (
                                        <>
                                            <Card className='m-2' onPress={() => handleClickOpen(step.id_origen)} isPressable fullWidth>
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
                                                            <h5 className="text-small tracking-tight text-default-400">Viaje: {step.referencia_viaje}</h5>
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
                            </DrawerBody>
                            <DrawerFooter>
                                <Button color="primary" onPress={onClose}>
                                    Cerrar
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}
