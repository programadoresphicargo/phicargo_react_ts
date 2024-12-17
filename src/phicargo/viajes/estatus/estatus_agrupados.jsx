import React, { useState, useEffect, useMemo, useContext } from 'react';
import { ViajeContext } from '../context/viajeContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Button } from '@nextui-org/button';
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import BotonMapa from './botonMapa';
import BotonDistanciaMapa from './enlaceDistancia';
import PanelEnvio from '../panel_envio_estatus/panel_envio';
import { CircularProgress } from "@nextui-org/react";
import ArchivosAdjuntos from './archivos_adjuntos';
import axios from 'axios';
import { tiempoTranscurrido } from '../../funciones/tiempo';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';
const { VITE_PHIDES_API_URL } = import.meta.env;

function EstatusHistorialAgrupado({ registros_agrupados }) {

    const [open, setOpen] = React.useState(false);
    const [estatus, setEstatus] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);

    const [id_reporte, setIDReporte] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [estatus_seleccionado, setEstatusSeleccionado] = useState(null);
    const [fileList, setFileList] = useState([]);

    const handleClickOpen = (id_reporte) => {
        setOpen(true);
        getEstatusReenvio(id_reporte);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getEstatus();
    }, [registros_agrupados]);

    const getEstatus = async () => {

        try {
            setLoading(true);
            const response = await fetch(VITE_PHIDES_API_URL + '/viajes/historial_estatus/getEstatus.php', {
                method: 'POST',
                body: new URLSearchParams({
                    estatus: registros_agrupados,
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

    const getEstatusReenvio = async (id_reporte) => {
        try {
            const response = await fetch(VITE_PHIDES_API_URL + '/viajes/reenvio_estatus/getEstatus.php', {
                method: 'POST',
                body: new URLSearchParams({
                    id_reporte: id_reporte,
                }),
            })
            const jsonData = await response.json();
            const data = await jsonData[0];

            setIDReporte(data.id_reporte);
            setEstatusSeleccionado(data.id_estatus);
            setComentarios(data.comentarios_estatus);

        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    const agregarArchivoDesdeUrl = async (url) => {
        try {
            // Descargar el archivo desde la URL
            const response = await axios.get(url, { responseType: 'blob' });
            const blob = response.data;

            // Crear un nuevo objeto File
            const nombreArchivo = url.split('/').pop(); // Tomar el nombre desde la URL
            const nuevoArchivo = new File([blob], nombreArchivo, { type: blob.type });

            // Actualizar la lista de archivos
            setFileList((prevList) => [
                ...prevList,
                {
                    uid: Date.now().toString(),
                    name: nuevoArchivo.name,
                    status: 'done',
                    url: URL.createObjectURL(nuevoArchivo),
                    originFileObj: nuevoArchivo,
                },
            ]);
        } catch (error) {
            console.error('Error al añadir el archivo desde la URL:', error);
        }
    };

    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2, fontFamily: 'Inter' }} id="customized-dialog-title">
                Detalle de estatus
            </DialogTitle>

            {isLoading && (
                <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                    <CircularProgress size="lg" aria-label="Loading..." />
                </div>
            )}

            {!isLoading && (
                <Accordion variant="splitted">
                    {estatus.map((step, index) => (
                        <AccordionItem key={step.id_reporte}
                            aria-label={step.id_reporte}
                            title={
                                <>
                                    <div class="d-flex">
                                        <div>{step.nombre_estatus}</div>
                                        {step.id_reenvio !== null && (
                                            <div className="ml-auto">
                                                <span className="badge rounded-pill bg-success"><i class="bi bi-check2"></i> Reenviado R-{step.id_reenvio}</span>
                                            </div>
                                        )}

                                    </div>
                                </>
                            }
                            subtitle={tiempoTranscurrido(step.fecha_envio)}
                            isCompact
                            isBordered
                            startContent={
                                <Avatar
                                    style={{ zIndex: 1 }}
                                    isBordered
                                    color="primary"
                                    radius="xl"
                                    src={VITE_PHIDES_API_URL + `/img/status/${step.imagen}`}
                                />
                            }
                        >
                            <Card className="max-w-full m-3">
                                <CardHeader className="justify-between">
                                    <div className="flex gap-5">
                                        <Avatar
                                            isBordered
                                            radius="full"
                                            size="md"
                                            src={VITE_PHIDES_API_URL + "/img/operador.png"}
                                        />
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-small font-semibold leading-none text-default-600">Enviado por</h4>
                                            <h5 className="text-small tracking-tight text-default-400">{step.name}</h5>
                                        </div>
                                    </div>

                                    {tiempoTranscurrido(step.fecha_hora)}
                                </CardHeader>
                                <CardBody className="text-small text-default-500">
                                    <span>Referencia reporte: {step.id_reporte}</span>
                                    <span>Placas: {step.placas}</span>
                                    <span>Coordenadas: {step.latitud},{step.longitud}</span>
                                    <span>Localidad: {step.localidad}</span>
                                    <span>Sublocalidad: {step.sublocalidad}</span>
                                    <span>Calle: {step.calle}</span>
                                    <span>Codigo postal: {step.codigo_postal}</span>
                                    <span>Fecha y hora: {step.fecha_hora}</span>

                                    < ArchivosAdjuntos id_reporte={step.id_reporte} ></ArchivosAdjuntos>

                                </CardBody>
                                <CardFooter className="gap-3">
                                    <Button color="success" className='text-white me-2' variant="solid" onClick={() => handleClickOpen(step.id_reporte)}>
                                        <i class="bi bi-reply"></i>
                                        Reenviar
                                    </Button>

                                    <BotonMapa latitud={step.latitud} longitud={step.longitud}></BotonMapa>
                                    <BotonDistanciaMapa></BotonDistanciaMapa>
                                </CardFooter>
                            </Card>

                            {step.comentarios_estatus != '' ? (
                                <Card className="max-w-full m-4">
                                    <CardHeader className="justify-between">
                                        <div className="flex gap-5">
                                            <Avatar
                                                isBordered
                                                radius="full"
                                                size="md"
                                                src={VITE_PHIDES_API_URL + "/img/operador.png"}
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
                                                src={VITE_PHIDES_API_URL + "/img/operador.png"}
                                            />
                                            <div className="flex flex-col gap-1 items-start justify-center">
                                                <h4 className="text-small font-semibold leading-none text-default-600">Enviado por</h4>
                                                <h5 className="text-small tracking-tight text-default-400">{step.name}</h5>
                                            </div>
                                        </div>

                                        {tiempoTranscurrido(step.fecha_hora)}
                                    </CardHeader>
                                    <CardBody className="text-small text-default-500">
                                        <span class="d-block fs-5 text-dark text-truncate">Referencia reenvio: <span class="text-muted">{step.id_reenvio}</span></span>
                                        <span class="d-block fs-5 text-dark text-truncate">Reenviado por: <span class="text-muted">{step.usuario_reenvio}</span></span>
                                        <span class="d-block fs-5 text-dark">Fecha reenvio: <span class="text-muted">{tiempoTranscurrido(step.fecha_reenvio)}</span></span>
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

            <PanelEnvio open={open} cerrar={handleClose} id_reporte={id_reporte} estatusSeleccionado={estatus_seleccionado} comentariosEstatus={comentarios} archivos={fileList}></PanelEnvio>

        </>
    )
}

export default EstatusHistorialAgrupado;
