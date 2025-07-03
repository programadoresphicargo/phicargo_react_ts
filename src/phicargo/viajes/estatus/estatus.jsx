import { Card, CardHeader } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Avatar } from "@heroui/react";
import { Badge } from "@heroui/react";
import { Button } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import EstatusHistorialAgrupado from './estatus_agrupados';
import { Progress } from "@heroui/react";
import Slide from '@mui/material/Slide';
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { tiempoTranscurrido } from '../../funciones/tiempo';
import { DatePicker } from "@heroui/react";
import { parseZonedDateTime, parseAbsoluteToLocal } from "@internationalized/date";
import { Stack } from "rsuite";
const { VITE_ODOO_API_URL } = import.meta.env;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function EstatusHistorial() {

    const { id_viaje } = useContext(ViajeContext);
    const [id_reportes_agrupados, setEstatusAgrupados] = useState([]);
    const [estatusHistorial, setHistorial] = useState([]);
    const [isLoading, setLoading] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const handleClickOpen = (id_registros, scrollType) => {
        setOpen(true);
        setScroll(scrollType);
        setEstatusAgrupados(id_registros);
    };

    const handleClose = () => {
        setOpen(false);
        getHistorialEstatus();
    };

    const getHistorialEstatus = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/reportes_estatus_viajes/by_id_viaje/${id_viaje}`);
            setHistorial(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getHistorialEstatus();
    }, []);

    return (
        <>
            <Stack className="mb-2">
                <Button color="primary" onPress={() => getHistorialEstatus()} startContent={<i class="bi bi-arrow-clockwise"></i>}>Refrescar</Button>
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
                    <EstatusHistorialAgrupado registros_agrupados={id_reportes_agrupados}></EstatusHistorialAgrupado>
                </DialogContent>
            </Dialog>

            {isLoading ? (
                <Progress size="sm" isIndeterminate color="primary" />
            ) : (
                <ol className="step">
                    {estatusHistorial.map((step, index) => {

                        const getBadgeClass = () => {
                            if (step.tipo_registrante == 'automatico') return "primary";
                            if (step.tipo_registrante == 'usuario') return "secondary";
                            if (step.tipo_registrante == 'operador') return "success";
                            return "secondary";
                        };

                        return (
                            <Card className="mb-2 w-full" isPressable onPress={() => handleClickOpen(step.id_reportes_agrupados, "body")}>
                                <CardHeader className="justify-between">
                                    <div className="flex gap-5">
                                        <Badge color="danger" content={step.registros} placement="top-right" isInvisible={step.registros > 1 ? false : true}>
                                            <Avatar
                                                color={`${getBadgeClass()}`}
                                                isBordered
                                                radius="full"
                                                size="md"
                                                src={VITE_ODOO_API_URL + `/assets/trafico/estatus_operativos/${step.imagen}`}
                                            />
                                        </Badge>
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-small font-semibold leading-none text-default-600">{step.nombre_estatus}</h4>
                                            <h5 className="text-small tracking-tight text-default-400">
                                                {step.nombre_registrante}
                                            </h5>
                                        </div>
                                    </div>

                                    {tiempoTranscurrido(step.ultima_fecha_envio)}
                                </CardHeader>
                            </Card>
                        );
                    })}
                </ol>
            )}
        </>
    )
}

export default EstatusHistorial;
