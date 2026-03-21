import { Button, ButtonGroup } from "@heroui/react";
import { Card, Chip, Divider } from "@heroui/react";
import { CardBody, CardHeader, Snippet } from "@heroui/react";
import React, { useContext, useEffect, useState } from "react";
import Contenedores from "../contenedores/contenedores";
import CumplimientoOperador from "../cumplimiento_operador/cumplimiento";
import EstatusHistorial from "../estatus/estatus";
import EstatusViaje from "./estado_viaje";
import Grid from '@mui/material/Grid2';
import PanelEnvio from '../panel_envio_estatus/panel_envio';
import { Spacer } from "@heroui/react";
import Stack from '@mui/material/Stack';
import { Steps } from 'antd';
import { ViajeContext } from "../context/viajeContext";
import axios from "axios";
import { fontFamily } from "@mui/system";
import { useJourneyDialogs } from "./funciones";
import Custodia from "../custodia/custodia";
import LlegadaTarde from "../llegada_tarde";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import SelectFlota from "@/phicargo/maniobras/maniobras/selects_flota";
import toast from "react-hot-toast";
import odooApi from "@/api/odoo-api";
import SelectOperador from "@/phicargo/maniobras/maniobras/select_operador";
import { useCatalogos } from "@/phicargo/catalogos/useCatalogos";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormEquipoViaje({ open, handleClose }) {

    const {
        drivers,
        tractores,
        trailers,
        dollies,
        motogeneradores,
        isLoading
    } = useCatalogos();

    const { iniciar_viaje, finalizar_viaje, liberar_resguardo, reactivar_viaje, comprobar_operador, comprobar_disponibilidad, calcular_estadia } = useJourneyDialogs();
    const { id_viaje, viaje, getViaje } = useContext(ViajeContext);
    const [isLoadingUpdate, setLoadingUpdate] = useState(false);
    const [originalData, setOriginalData] = useState({});

    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (open && !Object.keys(formData).length) {
            const data = {
                employee_id: viaje?.employee?.id || null,
                vehicle_id: viaje?.vehicle?.id || null,
                trailer1_id: viaje?.trailer1?.id || null,
                trailer2_id: viaje?.trailer2?.id || null,
                dolly_id: viaje?.dolly?.id || null,
                x_motogenerador_1: viaje?.x_motogenerador1?.id || null,
                x_motogenerador_2: viaje?.x_motogenerador2?.id || null,
            };

            setFormData(data);
            setOriginalData(data);
        }
    }, [open, viaje]);

    useEffect(() => {
        if (!open) {
            setFormData({});
            setOriginalData({});
        }
    }, [open]);

    const handleSelectChange = (value, name) => {
        setFormData(prev => ({
            ...prev,
            [name]: value ?? null,
        }));
    };

    const handleCloseWithValidation = () => {
        const hasChanges = Object.keys(formData).some(
            key => formData[key] !== originalData[key]
        );

        if (hasChanges) {
            if (!confirm("Tienes cambios sin guardar. ¿Seguro que quieres salir?")) {
                return;
            }
        }
        handleClose();
    };

    const SaveForm = async () => {
        try {
            setLoadingUpdate(true);

            let url = '/tms_travel/' + id_viaje;
            const res = await odooApi.patch(url, formData);

            if (res.data.status === "success") {
                toast.success(res.data.message);
                getViaje(id_viaje);
                handleClose();
            }

        } catch (error) {
            const detail = error.response?.data?.detail || error.message;
            toast.error("Error: " + detail);
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <>
            <React.Fragment>
                <Dialog
                    open={open}
                    slots={{
                        transition: Transition,
                    }}
                    keepMounted
                    onClose={handleCloseWithValidation}
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: "20px" // puedes subirlo a 20, 24, etc.
                        }
                    }}
                >
                    <DialogTitle>{"Equipo asignado a viaje"}</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2}>

                            <SelectOperador
                                label={'Operador'}
                                id={'employee_id'}
                                name={'employee_id'}
                                onChange={handleSelectChange}
                                value={formData.employee_id}
                                options={drivers}
                                isLoading={isLoading}
                            />

                            <SelectFlota
                                label="Vehiculo"
                                name="vehicle_id"
                                onChange={handleSelectChange}
                                value={formData.vehicle_id}
                                tipo="tractor"
                                options={tractores}
                                isLoading={isLoading}>
                            </SelectFlota>

                            <SelectFlota
                                label="Remolque 1"
                                name="trailer1_id"
                                onChange={handleSelectChange}
                                value={formData.trailer1_id}
                                tipo="trailer"
                                options={trailers}
                                isLoading={isLoading}>
                            </SelectFlota>

                            <SelectFlota
                                label="Remolque 2"
                                name="trailer2_id"
                                onChange={handleSelectChange}
                                value={formData.trailer2_id}
                                tipo="trailer"
                                options={trailers}
                                isLoading={isLoading}>
                            </SelectFlota>

                            <SelectFlota
                                label="Dolly"
                                name="dolly_id"
                                onChange={handleSelectChange}
                                value={formData.dolly_id}
                                tipo="dolly"
                                options={dollies}
                                isLoading={isLoading}>
                            </SelectFlota>

                            <SelectFlota
                                label="Motogenerador 1"
                                name="x_motogenerador_1"
                                onChange={handleSelectChange}
                                value={formData.x_motogenerador_1}
                                tipo="other"
                                options={motogeneradores}
                                isLoading={isLoading}>
                            </SelectFlota>

                            <SelectFlota
                                label="Motogenerador 2"
                                name="x_motogenerador_2"
                                onChange={handleSelectChange}
                                value={formData.x_motogenerador_2}
                                tipo="other"
                                options={motogeneradores}
                                isLoading={isLoading}>
                            </SelectFlota>

                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onPress={handleCloseWithValidation} radius="full">Cancelar</Button>
                        <Button onPress={SaveForm} color="success" className="text-white" radius="full" isLoading={isLoadingUpdate}><i className="bi bi-floppy-fill"></i>Guardar cambios</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </>

    );
}