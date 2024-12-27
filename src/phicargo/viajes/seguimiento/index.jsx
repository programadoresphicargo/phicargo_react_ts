import React, { useState, useEffect, useContext } from "react";
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PanelEnvio from '../panel_envio_estatus/panel_envio';
import axios from "axios";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Steps } from 'antd';
import { Spacer } from "@nextui-org/spacer";
import EstatusHistorial from "../estatus/estatus";
import { useJourneyDialogs } from "./funciones";
import Slide from '@mui/material/Slide';
import EstatusViaje from "./estado_viaje";
import { ViajeContext } from "../context/viajeContext";
import CumplimientoOperador from "../cumplimiento_operador/cumplimiento";
import { CardBody, CardHeader, Snippet } from "@nextui-org/react";
import { fontFamily } from "@mui/system";
import Grid from '@mui/material/Grid2';
import { Card, Chip, Divider } from "@nextui-org/react";

export default function BasicButtons2() {

    const { iniciar_viaje, finalizar_viaje, liberar_resguardo, reactivar_viaje, comprobar_operador, comprobar_disponibilidad } = useJourneyDialogs();
    const { id_viaje, viaje, correosLigados } = useContext(ViajeContext);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Grid container spacing={2}>

                <Grid item size={12}>
                    <Card>
                        <CardBody>
                            <div className="flex items-center justify-between">

                                <div>
                                    <Stack spacing={1} direction="row">
                                        {viaje.estado == null && (
                                            <Button color="primary" onClick={comprobar_disponibilidad} isDisabled={correosLigados}><i class="bi bi-play-fill"></i> Iniciar viaje</Button>
                                        )}
                                        {['ruta', 'planta', 'retorno'].includes(viaje.estado) && (
                                            <Button color="danger" onClick={finalizar_viaje} isDisabled={correosLigados}><i class="bi bi-stop-fill"></i> Finalizar viaje</Button>
                                        )}
                                        <Button color="success" onClick={handleClickOpen} className="text-white" isDisabled={correosLigados}>
                                            <i className="bi bi-send-plus-fill"></i> Nuevo estatus
                                        </Button>
                                        {viaje.estado == 'resguardo' && (
                                            <Button color="primary" onClick={liberar_resguardo} isDisabled={correosLigados}>Liberar resguardo</Button>
                                        )}
                                        {viaje.estado == 'finalizado' && (
                                            <Button color="success" onClick={reactivar_viaje} className="text-white" isDisabled={correosLigados}>Reactivar viaje</Button>
                                        )}
                                    </Stack>
                                </div>

                                <div style={{ width: '45%' }}>
                                    <EstatusViaje></EstatusViaje>
                                </div>

                            </div>
                        </CardBody>
                    </Card>
                </Grid>

                <Grid item size={4}>
                    <Grid item size={12}>

                        <Card>
                            <CardHeader>
                                <Chip color='primary' size='lg' radius='md'>Información del viaje</Chip>
                            </CardHeader>
                            <CardBody>
                                <ul class="list-unstyled list-py-2 text-dark mb-0">
                                    <li class="pb-0"><span class="card-subtitle">Datos</span></li>
                                    <li>Vehiculo: {viaje.vehiculo}</li>
                                    <li>Operador: {viaje.operador}</li>
                                    <li>Ejecutiv@: {viaje.ejecutivo}</li>
                                    <li>Cliente: {viaje.cliente}</li>
                                    <li>Modo: {viaje.modo}</li>
                                    <li>Armado: {viaje.tipo_armado}</li>

                                    <li class="pt-4 pb-0"><span class="card-subtitle">Contenedores</span></li>
                                    <Snippet size="sm" variant="solid" color="primary" style={{ fontFamily: 'Inter' }}>{viaje.contenedores}</Snippet>
                                </ul>
                            </CardBody>
                        </Card>
                    </Grid>

                    <Grid item size={12}>
                        <Card className="mt-3">
                            <CardHeader>
                                <p>Porcentaje de cumplimiento de envio de estatus del operador</p>
                            </CardHeader>
                            <CardBody>
                                <CumplimientoOperador></CumplimientoOperador>
                            </CardBody>
                        </Card>
                    </Grid>
                </Grid>

                <Grid item size={8}>
                    <Card>
                        <CardHeader>
                            <p>Historial de estatus</p>
                        </CardHeader>
                        <CardBody>
                            <EstatusHistorial fetchData={iniciar_viaje}></EstatusHistorial>
                        </CardBody>
                    </Card>
                </Grid>
            </Grid>

            <PanelEnvio open={open} cerrar={handleClose}></PanelEnvio>
        </>

    );
}