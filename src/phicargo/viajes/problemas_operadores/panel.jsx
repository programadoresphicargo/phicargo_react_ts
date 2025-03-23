import { Avatar, AvatarGroup, AvatarIcon, Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react"
import React, { useEffect, useState, } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { CircularProgress } from "@heroui/react";
import { Container } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ReporteOperador from './reporte';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from "@/phicargo/modules/core/api/odoo-api";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
} from "@heroui/react";
export default function ProblemasOperadores({ isOpen, onOpen, onOpenChange }) {

    const [id_reporte, setIDReporte] = React.useState("");
    const [estatus, setEstatus] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);

    useEffect(() => {
        getEstatus();
    }, [isOpen]);

    const getEstatus = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/problemas_operadores/');
            setEstatus(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };


    const [openReporte, setOpenReporte] = React.useState(false);

    const handleClickOpen = (id_reporte) => {
        setIDReporte(id_reporte);
        setOpenReporte(true);
    };

    const handleCloseReporte = () => {
        setOpenReporte(false);
    };

    return (
        <div>
            <Drawer isOpen={isOpen} size={"lg"} onOpenChange={onOpenChange}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">Problemas del operador</DrawerHeader>
                            <DrawerBody>

                                {isLoading && (
                                    <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                                        <CircularProgress size="lg" aria-label="Loading..." color='danger' />
                                    </div>
                                )}

                                {estatus.map((step) => (
                                    <Card key={step.id_reporte} className="m-1" onPress={() => handleClickOpen(step.id_reporte)}>
                                        <CardBody className="px-3 text-small text-default-400">
                                            <div className="flex gap-5">
                                                <Avatar color='danger' isBordered radius="full" size="md" />
                                                <div className="flex flex-col gap-1 items-start justify-center">
                                                    <h4 className="text-small font-semibold leading-none text-default-600">{step.referencia}</h4>
                                                    <h5 className="text-small tracking-tight text-default-400">{step.nombre_operador}</h5>
                                                </div>
                                            </div>
                                        </CardBody>
                                        <CardFooter className="gap-3">
                                            <div className="flex gap-1">
                                                <p className=" text-default-400 text-small">{step.fecha_creacion}</p>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}

                            </DrawerBody>
                            <DrawerFooter>
                                <Button color="danger" variant="light" onPress={onOpenChange}>
                                    Cerrar
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <ReporteOperador id_reporte={id_reporte} isOpen={openReporte} onOpenChange={handleCloseReporte}></ReporteOperador>

        </div>
    );
}
