import { Card, CardHeader } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Avatar } from "@heroui/react";
import { Badge } from "@heroui/react";
import { Button, Chip } from "@heroui/react";
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

function EstatusHistorial() {

    const { id_viaje, drawerOpen, setDrawerOpen, id_reportes_agrupados, setEstatusAgrupados } = useContext(ViajeContext);
    const [estatusHistorial, setHistorial] = useState([]);
    const [isLoading, setLoading] = useState([]);

    const handleClickOpen = (id_registros) => {
        console.log(id_registros);
        setEstatusAgrupados(id_registros);
        setDrawerOpen(true);
    };

    const handleClose = () => {
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
                            <Card className="mb-2 w-full" isPressable onPress={() => handleClickOpen(step.id_reportes_agrupados)}>
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
