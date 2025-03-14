import { Button, ButtonGroup } from "@heroui/react";
import { Card, Chip, Divider } from "@heroui/react";
import { CardBody, CardHeader, Snippet } from "@heroui/react";
import React, { useContext, useEffect, useState } from "react";

import Contenedores from "../contenedores/contenedores";
import CumplimientoOperador from "../cumplimiento_operador/cumplimiento";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EstatusHistorial from "../estatus/estatus";
import EstatusViaje from "./estado_viaje";
import Grid from '@mui/material/Grid2';
import PanelEnvio from '../panel_envio_estatus/panel_envio';
import Slide from '@mui/material/Slide';
import { Spacer } from "@heroui/react";
import Stack from '@mui/material/Stack';
import { Steps } from 'antd';
import { ViajeContext } from "../context/viajeContext";
import axios from "axios";
import { fontFamily } from "@mui/system";
import { useJourneyDialogs } from "./funciones";

export default function BasicButtons2() {

    const { iniciar_viaje, finalizar_viaje, liberar_resguardo, reactivar_viaje, comprobar_operador, comprobar_disponibilidad } = useJourneyDialogs();
    const { id_viaje, viaje, correosLigados, isLoading } = useContext(ViajeContext);

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
                                            <Button color="primary" onPress={comprobar_disponibilidad} isDisabled={correosLigados || isLoading}><i class="bi bi-play-fill"></i> Iniciar viaje</Button>
                                        )}
                                        {['ruta', 'planta', 'retorno'].includes(viaje.estado) && (
                                            <Button color="danger" onPress={finalizar_viaje} isDisabled={correosLigados || isLoading}><i class="bi bi-stop-fill"></i> Finalizar viaje</Button>
                                        )}
                                        <Button color="success" onPress={handleClickOpen} className="text-white" isDisabled={correosLigados || isLoading}>
                                            <i className="bi bi-send-plus-fill"></i> Nuevo estatus
                                        </Button>
                                        {viaje.estado == 'resguardo' && (
                                            <Button color="primary" onPress={liberar_resguardo} isDisabled={correosLigados || isLoading}>Liberar resguardo</Button>
                                        )}
                                        {viaje.estado == 'finalizado' && (
                                            <Button color="success" onPress={reactivar_viaje} className="text-white" isDisabled={correosLigados || isLoading}>Reactivar viaje</Button>
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
                                    <li>Vehículo: {viaje.vehiculo}</li>
                                    <li>Operador: {viaje.operador}</li>
                                    <li>Ejecutiv@: {viaje.ejecutivo}</li>
                                    <li>Cliente: {viaje.cliente}</li>
                                    <li>Modo: {viaje.modo}</li>
                                    <li>Armado: {viaje.tipo_armado}</li>
                                    <li>Contenedores:</li>
                                    <Snippet color="primary" variant="solid" size="sm">{viaje.contenedores}</Snippet>
                                </ul>
                            </CardBody>
                        </Card>
                    </Grid>

                    <Card className="mt-3">
                        <CardHeader>
                            <Chip color="secondary">
                                Contenedores
                            </Chip>
                        </CardHeader>
                        <CardBody>
                            <Contenedores></Contenedores>
                        </CardBody>
                    </Card>

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
                        <Divider></Divider>
                        <CardBody>
                            <EstatusHistorial fetchData={iniciar_viaje} key={isLoading}></EstatusHistorial>
                        </CardBody>
                    </Card>
                </Grid>
            </Grid>

            <PanelEnvio open={open} cerrar={handleClose}></PanelEnvio>
        </>

    );
}