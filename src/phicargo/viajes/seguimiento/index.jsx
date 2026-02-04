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
import Custodia from "../custodia/custodia";
import LlegadaTarde from "../llegada_tarde";

export default function Seguimiento() {

    const { iniciar_viaje, finalizar_viaje, liberar_resguardo, reactivar_viaje, comprobar_operador, comprobar_disponibilidad, calcular_estadia } = useJourneyDialogs();
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

                <Custodia></Custodia>
                <LlegadaTarde></LlegadaTarde>

                <Grid item size={12}>
                    <Card>
                        <CardBody>
                            <div className="flex items-center justify-between">

                                <div>
                                    <Stack spacing={1} direction="row">
                                        {viaje?.x_status_viaje == null && (
                                            <Button color="primary" onPress={comprobar_disponibilidad} isDisabled={correosLigados || isLoading} radius="full"><i class="bi bi-play-fill"></i> Iniciar viaje</Button>
                                        )}
                                        {['ruta', 'planta', 'retorno'].includes(viaje?.x_status_viaje) && (
                                            <Button color="danger" onPress={finalizar_viaje} isDisabled={correosLigados || isLoading} radius="full"><i class="bi bi-stop-fill"></i> Finalizar viaje</Button>
                                        )}
                                        <Button color="success" onPress={handleClickOpen} className="text-white" isDisabled={correosLigados || isLoading} radius="full">
                                            <i className="bi bi-send-plus-fill"></i> Nuevo estatus
                                        </Button>
                                        {viaje?.x_status_viaje == 'resguardo' && (
                                            <Button color="primary" onPress={liberar_resguardo} isDisabled={correosLigados || isLoading} radius="full">Liberar resguardo</Button>
                                        )}
                                        {viaje?.x_status_viaje == 'finalizado' && (
                                            <Button color="success" onPress={reactivar_viaje} className="text-white" isDisabled={correosLigados || isLoading} radius="full">Reactivar viaje</Button>
                                        )}

                                        <Button color="danger" onPress={() => calcular_estadia(id_viaje)} className="text-white" radius="full">Generar estadías</Button>
                                    </Stack>
                                </div>

                                <div style={{ width: '55%' }}>
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
                            <CardBody className="bg-white rounded-xl shadow p-4">
                                <div className="grid sm:grid-cols-2 gap-y-2 gap-x-4 text-gray-800 text-sm">
                                    {/* Sección: Equipo de viaje */}
                                    <div className="sm:col-span-2">
                                        <h2 className="text-base font-semibold text-gray-700 border-b pb-1 mb-2">Equipo de viaje</h2>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Vehículo:</span>
                                        <div>{viaje?.vehicle?.name || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Remolque 1:</span>
                                        <div>{viaje?.trailer1?.name || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Remolque 2:</span>
                                        <div>{viaje?.trailer2?.name || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Dolly:</span>
                                        <div>{viaje?.dolly?.name || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Motogenerador 1:</span>
                                        <div>{viaje?.x_motogenerador1?.name || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Motogenerador 2:</span>
                                        <div>{viaje?.x_motogenerador2?.name || '—'}</div>
                                    </div>

                                    {/* Sección: Datos del viaje */}
                                    <div className="sm:col-span-2 mt-4">
                                        <h2 className="text-base font-semibold text-gray-700 border-b pb-1 mb-2">Datos del viaje</h2>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Operador:</span>
                                        <div>{viaje?.employee?.name || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Ejecutiv@:</span>
                                        <div>{viaje?.x_ejecutivo_viaje_bel || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Cliente:</span>
                                        <div>{viaje?.partner?.name || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Inicio programado:</span>
                                        <div>{viaje?.inicio_programado || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Llegada a planta programada:</span>
                                        <div>{viaje?.llegada_planta_programada || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Inicio real de viaje:</span>
                                        <div>{viaje?.fecha_inicio || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Finalización:</span>
                                        <div>{viaje?.fecha_finalizado || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Modo:</span>
                                        <div>{viaje?.x_modo_bel || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Armado:</span>
                                        <div>{viaje?.x_tipo_bel || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Origen:</span>
                                        <div>{viaje?.origen || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Dirección origen:</span>
                                        <div>{viaje?.direccion_origen?.name || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Dirección destino:</span>
                                        <div>{viaje?.direccion_destino?.name || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Ruta:</span>
                                        <div>{viaje?.route?.name || '—'}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Código postal:</span>
                                        <div>{viaje?.x_codigo_postal || '—'}</div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="font-semibold text-gray-600 block mb-1">Contenedores:</span>
                                        <Snippet color="primary" variant="solid" size="sm">
                                            {viaje?.x_references || '—'}
                                        </Snippet>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="font-semibold text-gray-600 block mb-1">Referencia cliente:</span>
                                        <Snippet color="success" variant="solid" size="sm" className="text-white">
                                            {viaje?.client_order_ref || '—'}
                                        </Snippet>
                                    </div>
                                </div>
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