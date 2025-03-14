import { Badge, Chip } from "@heroui/react";
import { Card, CardHeader } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { Avatar } from "@heroui/react";
import { Button } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import EstatusHistorialAgrupado from './estatus_agrupados';
import Slide from '@mui/material/Slide';
import { Stack } from 'rsuite';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { tiempoTranscurrido } from '../../funciones/tiempo';
import { toast } from 'react-toastify';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function EstatusHistorialManiobras({ id_maniobra }) {

    const [estatusHistorial, setHistorial] = React.useState([]);
    const [id_reporte, setReporte] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [isLoading, setLoading] = React.useState(false);

    const handleClickOpen = (id_registro, scrollType) => {
        setOpen(true);
        setScroll(scrollType);
        setReporte(id_registro);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getHistorialEstatus = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/estatus_maniobras/estatus_by_id_maniobra/' + id_maniobra)
            setHistorial(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        getHistorialEstatus();
    }, []);

    return (
        <>
            <Stack className='mb-3'>
                <Button color='primary' onPress={getHistorialEstatus} isLoading={isLoading}>Actualizar historial</Button>
            </Stack>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                scroll={scroll}
                keepMounted
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"md"}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '20px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.0)',
                    },
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                }}
            >
                <DialogContent dividers={scroll === 'paper'}>
                    <EstatusHistorialAgrupado id_reporte={id_reporte}></EstatusHistorialAgrupado>
                </DialogContent>
            </Dialog>

            <ol className="step">
                {estatusHistorial.map((step, index) => {

                    const getBadgeClass = () => {
                        if (step.id_usuario == 172 || step.id_usuario == 8) return "primary";
                        if ([5, 6].includes(step.department_id)) return "success";
                        return "secondary";
                    };

                    return (
                        <Card className="mb-2 w-full" isPressable onClick={() => handleClickOpen(step.id_reporte, "body")}>
                            <CardHeader className="justify-between">
                                <div className="flex gap-5">
                                    <Badge color="danger" content={step.registros} placement="top-right" isInvisible={step.registros > 1 ? false : true}>
                                        <Avatar
                                            color={`${getBadgeClass()}`}
                                            isBordered
                                            radius="full"
                                            size="md"
                                            src={`/img/status/`}
                                        />
                                    </Badge>
                                    <div className="flex flex-col gap-1 items-start justify-center">
                                        <h4 className="text-small font-semibold leading-none text-default-600">{step.nombre_estatus}</h4>
                                        <Chip color='success' className='text-white' size='sm'>{step.comentarios_estatus}</Chip>
                                        <h5 className="text-small tracking-tight text-default-400">
                                            {step.nombre}
                                        </h5>
                                    </div>
                                </div>
                                {tiempoTranscurrido(step.fecha_hora)}
                            </CardHeader>
                        </Card>
                    );
                })}
            </ol>
        </>
    )
}

export default EstatusHistorialManiobras;
