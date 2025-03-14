import { Avatar, AvatarGroup, AvatarIcon, Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react"
import React, { useEffect, useState, } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { CircularProgress } from "@heroui/react";
import { Container } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ReporteOperador from './reporte';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
const { VITE_PHIDES_API_URL } = import.meta.env;

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
            const response = await fetch(VITE_PHIDES_API_URL + '/viajes/problemas_operadores/getProblemas.php', {
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


                {isLoading && (
                    <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                        <CircularProgress size="lg" aria-label="Loading..." color='danger' />
                    </div>
                )}

                {estatus.map((step, index) => (
                    <>
                        <Card className="m-2" onPress={() => handleClickOpen(step.id_reporte)} isPressable>
                            <CardBody className="px-3 text-small text-default-400">
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
                            </CardBody>
                            <CardFooter className="gap-3">
                                <div className="flex gap-1">
                                    <p className=" text-default-400 text-small">{step.fecha_creacion}</p>
                                </div>
                            </CardFooter>
                        </Card>
                    </>
                ))}

                <ReporteOperador id_reporte={id_reporte} open={openReporte} onClose={handleCloseReporte}></ReporteOperador>

            </Drawer>
        </div>
    );
}
