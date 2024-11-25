import React, { useState, useEffect, useContext } from "react";
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
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
            <div className="row">

                <div className="col-12">
                    <div className="card shadow p-2 bg-white rounded mb-3">
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
                    </div>
                </div>

                <div className="col-sm-12 col-lg-8">
                    <div className="card shadow bg-white rounded">
                        <div className="card-header">
                            Historial de estatus
                        </div>
                        <div class="card-content p-5">
                            <EstatusHistorial fetchData={iniciar_viaje}></EstatusHistorial>
                        </div>
                    </div>
                </div>

                <div className="col-4">
                    <div className="card shadow bg-white rounded">
                        <div className="card-header">
                            Porcentaje de cumplimiento de envio de estatus del operador
                        </div>
                        <div class="card-content p-3">
                            <CumplimientoOperador></CumplimientoOperador>
                        </div>
                    </div>
                </div>
            </div >

            <PanelEnvio open={open} cerrar={handleClose}></PanelEnvio>
        </>

    );
}