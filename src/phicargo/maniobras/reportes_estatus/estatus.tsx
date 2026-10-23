import { Chip } from "@heroui/react";
import { Card, CardHeader } from "@heroui/react";
import React, { useEffect } from 'react';
import { Avatar } from "@heroui/react";
import { Button } from "@heroui/react";
import EstatusHistorialAgrupado from './estatus_agrupados';
import { Stack } from 'rsuite';
import odooApi from '@/api/odoo-api';
import { tiempoTranscurrido } from '../../funciones/tiempo';
import { Estatus } from "./type";
import EvidenciasChecklistViaje from "@/phicargo/viajes/estatus/evidencias_checklist";

const { VITE_ODOO_API_URL } = import.meta.env;

function EstatusHistorialManiobras({ id_maniobra }: { id_maniobra: number }) {

    const [estatusHistorial, setHistorial] = React.useState<Estatus[]>([]);
    const [id_reporte, setReporte] = React.useState<number | null>(null);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    const handleClickOpen = (id_registro: number) => {
        setOpen(true);
        setReporte(id_registro);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getHistorialEstatus = async () => {
        if (!id_maniobra) return;

        try {
            setLoading(true);
            const response = await odooApi.get('/maniobras/reportes_estatus_maniobras/id_maniobra/' + id_maniobra)
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
                <Button color='primary' onPress={getHistorialEstatus} isLoading={isLoading} radius="md" size="sm">Actualizar</Button>
            </Stack>

            {id_reporte && (
                <EstatusHistorialAgrupado id_reporte={id_reporte} open={open} handleClose={handleClose}></EstatusHistorialAgrupado>
            )}

            <EvidenciasChecklistViaje id={id_maniobra} tipo_checklist="reingreso" table="checklist_maniobras"></EvidenciasChecklistViaje>

            <ol className="relative space-y-0">
                {estatusHistorial.map((step, index) => {
                    const getBadgeClass = () => {
                        if (step.id_usuario == 172 || step.id_usuario == 8)
                            return "primary";
                        if ([5, 6].includes(step.department_id))
                            return "success";
                        return "default";
                    };

                    const color = getBadgeClass();
                    const isLast = index === estatusHistorial.length - 1;

                    return (
                        <li key={step.id_reporte} className="relative pl-8 pb-5">
                            {/* Línea vertical que conecta los eventos */}
                            {!isLast && (
                                <span
                                    className="absolute left-[11px] top-7 bottom-0 w-px bg-default-200"
                                    aria-hidden="true"
                                />
                            )}

                            {/* Punto de la línea del tiempo */}
                            <span
                                className={`absolute left-0 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background ${color === "primary"
                                        ? "bg-primary"
                                        : color === "success"
                                            ? "bg-success"
                                            : "bg-default-300"
                                    }`}
                            >
                                <span className="h-2 w-2 rounded-full bg-white" />
                            </span>

                            {/* Tarjeta del evento */}
                            <Card
                                isPressable
                                onPress={() => handleClickOpen(step.id_reporte)}
                                className="w-full border border-default-200 bg-content1 transition-colors hover:border-primary-300 hover:bg-default-50 dark:hover:bg-default-100/10"
                                shadow="sm"
                            >
                                <CardHeader className="flex items-start justify-between gap-3 p-3">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <Avatar
                                            color={color}
                                            isBordered
                                            radius="full"
                                            size="sm"
                                            src={
                                                step.imagen
                                                    ? `${VITE_ODOO_API_URL}/assets/trafico/estatus_operativos/${step.imagen}`
                                                    : undefined
                                            }
                                            name={step.nombre_estatus?.charAt(0)}
                                            className="shrink-0"
                                        />

                                        <div className="flex min-w-0 flex-col items-start gap-1.5">
                                            <h4 className="text-sm font-semibold leading-snug text-default-700">
                                                {step.nombre_estatus}
                                            </h4>

                                            {step.comentarios_estatus && (
                                                <Chip
                                                    color="success"
                                                    variant="flat"
                                                    size="sm"
                                                    className="h-auto max-w-full"
                                                >
                                                    <span className="whitespace-normal break-words py-0.5 text-left">
                                                        {step.comentarios_estatus}
                                                    </span>
                                                </Chip>
                                            )}

                                            <span className="text-xs text-default-400">
                                                {step.nombre_registrante}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 pt-1 text-right">
                                        <span className="text-xs font-medium text-default-500">
                                            {tiempoTranscurrido(step.fecha_hora)}
                                        </span>
                                    </div>
                                </CardHeader>
                            </Card>
                        </li>
                    );
                })}
            </ol>

            <EvidenciasChecklistViaje id={id_maniobra} tipo_checklist="salida" table="checklist_maniobras"></EvidenciasChecklistViaje>
        </>
    )
}

export default EstatusHistorialManiobras;
