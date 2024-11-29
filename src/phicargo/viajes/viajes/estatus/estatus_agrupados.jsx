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
import { tiempoTranscurrido } from '../../../funciones/tiempo';

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
            const response = await fetch('/phicargo/viajes/historial_estatus/getEstatus.php', {
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
            const response = await fetch('/phicargo/viajes/reenvio_estatus/getEstatus.php', {
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
            //agregarArchivoDesdeUrl('/phicargo/img/map.png');

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
                                    src={`/phicargo/img/status/${step.imagen}`}
                                />
                            }
                        >
                            <ul class="step">
                                <li class="step-item">
                                    <div class="step-content-wrapper">

                                        <span class="step-avatar">
                                            <img class="step-avatar-img" src="/phicargo/img/operador.png" alt="Image Description" />
                                        </span>

                                        <div class="step-content">
                                            <h5 class="mb-1">Enviado por</h5>

                                            <p class="fs-5 mb-1">{step.name}</p>

                                            <ul class="list-group list-group-sm">
                                                <li class="list-group-item list-group-item-light">
                                                    <div class="row">
                                                        <div class="col-12">
                                                            <span class="d-block fs-5 text-dark text-truncate">Referencia reporte: <span class="text-muted">{step.id_reporte}</span></span>
                                                            <span class="d-block fs-5 text-dark text-truncate">Placas: <span class="text-muted">{step.placas}</span></span>
                                                            <span class="d-block fs-5 text-dark text-truncate">Coordenadas: <span class="text-muted">{step.latitud},{step.longitud}</span></span>
                                                            <span class="d-block fs-5 text-dark">Localidad: <span class="text-muted">{step.localidad}</span></span>
                                                            <span class="d-block fs-5 text-dark">Sublocalidad: <span class="text-muted">{step.sublocalidad}</span></span>
                                                            <span class="d-block fs-5 text-dark">Calle: <span class="text-muted">{step.calle}</span></span>
                                                            <span class="d-block fs-5 text-dark">Codigo postal: <span class="text-muted">{step.codigo_postal}</span></span>
                                                            <span class="d-block fs-5 text-dark text-truncate">Fecha y Hora: <span class="text-muted">{tiempoTranscurrido(step.fecha_hora)}</span></span>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>

                                            {step.comentarios_estatus != '' ? (
                                                <li class="step-item mt-3">
                                                    <div class="step-content-wrapper">
                                                        <div class="step-avatar">
                                                            <img class="step-avatar-img" src="/phicargo/img/operador.png" alt="Image Description" />
                                                        </div>

                                                        <div class="step-content">

                                                            <p class="fs-5 mb-1">Se añadio un comentario:</p>

                                                            <ul class="list-group list-group-sm">
                                                                <li class="list-group-item list-group-item-light">
                                                                    <div class="row gx-1">
                                                                        <div class="col">
                                                                            <p class="text-body fs-5">{step.comentarios_estatus}</p>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>

                                                            <span class="small text-muted text-uppercase">{step.fecha_envio}</span>
                                                        </div>
                                                    </div>
                                                </li>) : (null)}

                                            < ArchivosAdjuntos id_reporte={step.id_reporte} ></ArchivosAdjuntos>

                                            {step.id_reenvio !== null ? (
                                                <ul class="list-group list-group-sm mt-2">
                                                    <li class="list-group-item list-group-item-light">
                                                        <div class="row">
                                                            <div class="col-12">
                                                                <span class="d-block fs-5 text-dark text-truncate">Referencia reenvio: <span class="text-muted">{step.id_reenvio}</span></span>
                                                                <span class="d-block fs-5 text-dark text-truncate">Reenviado por: <span class="text-muted">{step.usuario_reenvio}</span></span>
                                                                <span class="d-block fs-5 text-dark">Fecha reenvio: <span class="text-muted">{tiempoTranscurrido(step.fecha_reenvio)}</span></span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>) : (null)}

                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mt-3">
                                        <Button color="success" className='text-white me-2' variant="solid" onClick={() => handleClickOpen(step.id_reporte)}>
                                            <i class="bi bi-reply"></i>
                                            Reenviar
                                        </Button>

                                        <BotonMapa latitud={step.latitud} longitud={step.longitud}></BotonMapa>
                                        <BotonDistanciaMapa></BotonDistanciaMapa>
                                    </div>

                                </li>
                            </ul>

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
