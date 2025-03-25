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
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { tiempoTranscurrido } from '../../funciones/tiempo';
import ReporteOperador from "./reporte";
import { Chip } from "@heroui/react";

export default function ProblemasOperadores2({ isOpen, onOpen, onOpenChange }) {

    const [id_reporte, setIDReporte] = React.useState("");
    const [estatus, setEstatus] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);

    const [openReporte, setOpenReporte] = React.useState(false);

    const handleClickOpen = (id_reporte) => {
        setIDReporte(id_reporte);
        setOpenReporte(true);
    };

    const handleCloseReporte = () => {
        setOpenReporte(false);
    };

    useEffect(() => {
        getEstatus();
    }, [open]);

    const getEstatus = async () => {

        try {
            setLoading(true);
            const response = await odooApi.get('/problemas_operadores/');
            console.log(response.data);
            setEstatus(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    return (
        <>
            <ReporteOperador id_reporte={id_reporte} isOpen={openReporte} onOpenChange={handleCloseReporte}></ReporteOperador>
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
                            <DrawerHeader className="flex flex-col gap-1">Problemas operador</DrawerHeader>
                            <DrawerBody>

                                <ul class="list-group list-group-flush navbar-card-list-group">

                                    {isLoading && (
                                        <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                                            <CircularProgress size="lg" aria-label="Loading..." />
                                        </div>
                                    )}

                                    {estatus.map((step, index) => (
                                        <>
                                            <Card className='m-2' onPress={() => handleClickOpen(step.id_reporte)} isPressable fullWidth>
                                                <CardHeader className="justify-between">
                                                    <div className="flex gap-5">
                                                        <Avatar
                                                            color='danger'
                                                            isBordered
                                                            radius="full"
                                                            size="md"
                                                        />
                                                        <div className="flex flex-col gap-1 items-start justify-center">
                                                            <h4 className="text-small font-semibold leading-none text-default-600">{step.referencia}</h4>
                                                            <h5 className="text-small tracking-tight text-default-400">{step.nombre_operador}</h5>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardFooter className="gap-3">
                                                    <div className="flex gap-1">
                                                        <p className="font-semibold text-default-400 text-small">{step.fecha_creacion}</p>
                                                    </div>

                                                    {step.atendido && (
                                                        <Chip color="success" className="text-white">Atendido</Chip>
                                                    )}
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
