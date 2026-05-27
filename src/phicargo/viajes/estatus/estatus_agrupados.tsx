import { Accordion, AccordionItem, Avatar, Progress } from "@heroui/react";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import React, { useEffect, useState } from 'react';
import ArchivosAdjuntos from './archivos_adjuntos';
import BotonDistanciaMapa from './enlaceDistancia';
import BotonMapa from './botonMapa';
import { Button } from "@heroui/react";
import PanelEnvio from '../panel_envio_estatus/panel_envio';
import odooApi from '@/api/odoo-api';
import { tiempoTranscurrido } from '../../funciones/tiempo';
import { DatePicker } from "@heroui/react";
import { parseZonedDateTime } from "@internationalized/date";
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";

export type EstatusAgrupados = {
    nombre_estatus: string;
    tipo_registrante: string;
    ultima_fecha_envio: string;
    nombre_registrante: string;
    imagen: string;
    registros: number;
    id_reportes_agrupados: number[],
    id_reporte: number;
    latitud: number;
    longitud: number;
    localidad: string;
    sublocalidad: string;
    calle: string;
    codigo_postal: number;
    placas: string;
    fecha_hora: string;
    fecha_envio: string;
    id_reenvio: number;
    usuario_reenvio: string;
    fecha_reenvio: string;
    comentarios_estatus: string;
    name: string;
    primera_fecha_envio: string;
}

type PickerValue = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
};

const { VITE_ODOO_API_URL } = import.meta.env;

function EstatusHistorialAgrupado({ id_reportes_agrupados }: { id_reportes_agrupados: number[] }) {

    const [open, setOpen] = React.useState(false);
    const [estatus, setEstatus] = React.useState<EstatusAgrupados[]>([]);
    const [isLoading, setLoading] = React.useState(false);
    const [id_reporte, setIDReporte] = useState<number | null>(null);
    const [enabledPickers, setEnabledPickers] = useState(Array(estatus.length).fill(false));
    const [pickerValues, setPickerValues] = useState<(PickerValue | null)[]>([]);
    const { session } = useAuthContext();

    const handleClickOpen = (id_reporte: number) => {
        setOpen(true);
        setIDReporte(id_reporte);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getEstatus();
    }, [id_reportes_agrupados]);

    const getEstatus = async () => {
        if (id_reportes_agrupados.length === 0) {
            return;
        }
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/reportes_estatus_viajes/by_id_reportes/' + id_reportes_agrupados);
            setEstatus(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    const ActualizarFechaEstatus = async (id_reporte: number, fecha_hora: string) => {
        try {
            const response = await odooApi.post('/tms_travel/reportes_estatus_viajes/actualizar_estatus_fecha/' + id_reporte + '/' + fecha_hora);
            if (response.data.status == 'success') {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            setLoading(false);
            toast.error('Error al obtener los datos:' + error);
        }
    };

    const getBadgeClass = (tipo_registrante: string) => {
        if (tipo_registrante == 'automatico') return "primary";
        if (tipo_registrante == 'usuario') return "secondary";
        if (tipo_registrante == 'operador') return "success";
        return "secondary";
    };

    return (
        <>
            {isLoading && (
                <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                    <Progress isIndeterminate size="sm"></Progress>
                </div>
            )}
            <div className="mt-5">
                {!isLoading && (
                    <Accordion variant="splitted" defaultExpandedKeys={["0"]}>
                        {estatus.map((step, index) => (
                            <AccordionItem
                                key={index}
                                title={
                                    <>
                                        <div className="d-flex">
                                            <div>{step.nombre_estatus}</div>
                                            {step.id_reenvio !== null && (
                                                <div className="ml-auto">
                                                    <Chip className="text-white" color='success'><i className="bi bi-check2"></i> Reenviado R-{step.id_reenvio}</Chip>
                                                </div>
                                            )}

                                        </div>
                                    </>
                                }
                                subtitle={tiempoTranscurrido(step.fecha_envio)}
                                isCompact
                                startContent={
                                    <Avatar
                                        isBordered
                                        color={`${getBadgeClass(step.tipo_registrante)}`}
                                        src={VITE_ODOO_API_URL + `/assets/trafico/estatus_operativos/${step.imagen}`}
                                    />
                                }
                            >
                                <Card className="max-w-full m-3">
                                    <CardHeader className="justify-between">
                                        <div className="flex gap-5">
                                            <Avatar
                                                color={`${getBadgeClass(step.tipo_registrante)}`}
                                                isBordered
                                                radius="full"
                                                size="md"
                                            />
                                            <div className="flex flex-col gap-1 items-start justify-center">
                                                <h4 className="text-small font-semibold leading-none text-default-600">Enviado por</h4>
                                                <h5 className="text-small tracking-tight text-default-400">{step.nombre_registrante}</h5>
                                            </div>
                                        </div>

                                        <div key={index} className="flex items-center gap-2">

                                            {session?.user?.permissions?.includes(150) && (
                                                <Button
                                                    radius="full"
                                                    color={enabledPickers[index] ? "primary" : "success"}
                                                    className="text-white"
                                                    onPress={() => {
                                                        const newStates = [...enabledPickers];
                                                        newStates[index] = !newStates[index];
                                                        setEnabledPickers(newStates);

                                                        if (enabledPickers[index]) {
                                                            const newValue = pickerValues[index];
                                                            const year = newValue?.year;
                                                            const month = String(newValue?.month).padStart(2, '0');
                                                            const day = String(newValue?.day).padStart(2, '0');
                                                            const hour = String(newValue?.hour).padStart(2, '0');
                                                            const minute = String(newValue?.minute).padStart(2, '0');
                                                            const second = String(newValue?.second).padStart(2, '0');
                                                            const formatted = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

                                                            ActualizarFechaEstatus(step.id_reporte, formatted);
                                                        }
                                                    }}
                                                >
                                                    {enabledPickers[index] ? "Guardar" : "Editar"}
                                                </Button>
                                            )}

                                            <DatePicker
                                                firstDayOfWeek="mon"
                                                className="max-w-xs"
                                                hideTimeZone
                                                isDisabled={!enabledPickers[index]}
                                                defaultValue={parseZonedDateTime(step.fecha_envio + "[America/Mexico_city]")}
                                                variant="bordered"
                                                label="Fecha"
                                                onChange={(newValue) => {
                                                    const newValues = [...pickerValues];
                                                    newValues[index] = newValue;
                                                    setPickerValues(newValues);
                                                }}
                                            />
                                        </div>

                                    </CardHeader>
                                    <CardBody className="text-small text-default-500">
                                        <span>Referencia reporte: {step.id_reporte}</span>
                                        <span>Placas: {step.placas}</span>
                                        <span>Coordenadas: {step.latitud},{step.longitud}</span>
                                        <span>Localidad: {step.localidad}</span>
                                        <span>Sublocalidad: {step.sublocalidad}</span>
                                        <span>Calle: {step.calle}</span>
                                        <span>Codigo postal: {step.codigo_postal}</span>
                                        <span>Fecha GPS: {step.fecha_hora}</span>
                                        <span>Fecha envío: {step.fecha_envio}</span>

                                        < ArchivosAdjuntos id_reporte={step.id_reporte} ></ArchivosAdjuntos>

                                    </CardBody>
                                    <CardFooter className="gap-3">
                                        <Button
                                            radius="full"
                                            color="success"
                                            className='text-white me-2'
                                            variant="solid"
                                            onPress={() => handleClickOpen(step.id_reporte)}>
                                            <i className="bi bi-reply"></i>
                                            Reenviar
                                        </Button>

                                        <BotonMapa latitud={step.latitud} longitud={step.longitud}></BotonMapa>
                                        <BotonDistanciaMapa latitud={step.latitud} longitud={step.longitud}></BotonDistanciaMapa>
                                    </CardFooter>
                                </Card>

                                {step.comentarios_estatus ? (
                                    <Card className="max-w-full m-4">
                                        <CardHeader className="justify-between">
                                            <div className="flex gap-5">
                                                <Avatar
                                                    isBordered
                                                    radius="full"
                                                    size="md"
                                                    src={VITE_ODOO_API_URL + "/img/operador.png"}
                                                />
                                                <div className="flex flex-col gap-1 items-start justify-center">
                                                    <h4 className="text-small font-semibold leading-none text-default-600">Añadio un comentario</h4>
                                                    <h5 className="text-small tracking-tight text-default-400">{step.name}</h5>
                                                </div>
                                            </div>

                                            {tiempoTranscurrido(step.fecha_hora)}
                                        </CardHeader>
                                        <CardBody className="text-small text-default-500">
                                            {step.comentarios_estatus}
                                        </CardBody>
                                        <CardFooter className="gap-3">
                                            <div className="flex gap-1">
                                                <p className=" text-default-400 text-small">{step.fecha_envio}</p>
                                            </div>
                                        </CardFooter>
                                    </Card>) : (null)}

                                {step.id_reenvio !== null ? (
                                    <Card className="max-w-full m-4">
                                        <CardHeader className="justify-between">
                                            <div className="flex gap-5">
                                                <Avatar
                                                    isBordered
                                                    radius="full"
                                                    size="md"
                                                    src={VITE_ODOO_API_URL + "/img/operador.png"}
                                                />
                                                <div className="flex flex-col gap-1 items-start justify-center">
                                                    <h4 className="text-small font-semibold leading-none text-default-600">Enviado por</h4>
                                                    <h5 className="text-small tracking-tight text-default-400">{step.name}</h5>
                                                </div>
                                            </div>

                                            {tiempoTranscurrido(step.fecha_hora)}
                                        </CardHeader>
                                        <CardBody className="text-small text-default-500">
                                            <span className="d-block fs-5 text-dark text-truncate">Referencia reenvio: <span className="text-muted">{step.id_reenvio}</span></span>
                                            <span className="d-block fs-5 text-dark text-truncate">Reenviado por: <span className="text-muted">{step.usuario_reenvio}</span></span>
                                            <span className="d-block fs-5 text-dark">Fecha reenvio: <span className="text-muted">{tiempoTranscurrido(step.fecha_reenvio)}</span></span>
                                        </CardBody>
                                        <CardFooter className="gap-3">
                                            <div className="flex gap-1">
                                                <p className=" text-default-400 text-small">Fecha y Hora: {tiempoTranscurrido(step.fecha_hora)}</p>
                                            </div>
                                        </CardFooter>
                                    </Card>) : (null)}

                            </AccordionItem>
                        ))}
                    </Accordion >
                )
                }

                <PanelEnvio open={open} cerrar={handleClose} id_reporte={id_reporte}></PanelEnvio>
            </div>
        </>
    )
}

export default EstatusHistorialAgrupado;
