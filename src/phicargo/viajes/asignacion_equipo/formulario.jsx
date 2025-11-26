import React, { useEffect, useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button as MUIButton,
    TextField,
} from "@mui/material";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import SelectFlota from '@/phicargo/maniobras/maniobras/selects_flota';
import HistorialCambioEquipo from './historial';
import Swal from "sweetalert2";
import { Button, Progress, Textarea } from '@heroui/react';

const FormularioAsignacionEquipo = ({ id_cp, id_pre_asignacion, isOpen, onOpenChange }) => {

    const historialRef = useRef(null);
    const [isEditMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ id_cp });
    const isDisabled = id_pre_asignacion ? !isEditMode : false;
    const [isLoading, setLoading] = useState(false);
    const [comentarios, setComentarios] = useState("");

    useEffect(() => {
        setFormData({ id_cp });
        setEditMode(false);
        getData();
    }, [id_cp, id_pre_asignacion]);

    const handleSelectChange = (value, name) => {
        setFormData(prev => ({
            ...prev,
            [name]: value ?? null,
        }));
    };

    const guardar = async () => {
        try {
            setLoading(true);

            let url = '/preasignacion_equipo/';

            if (comentarios?.trim()) {
                url += `?comentarios=${encodeURIComponent(comentarios.trim())}`;
            }

            const res = await odooApi.post(url, formData);

            if (res.data.status === "success") {
                toast.success(res.data.message);
                historialRef.current?.reload();
                setComentarios("");
            }

            onOpenChange(false);
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const actualizar = async () => {
        if (!comentarios.trim()) {
            toast.error("El campo comentarios es obligatorio.");
            return;
        }

        try {
            setLoading(true);

            const res = await odooApi.patch(
                `/preasignacion_equipo/${id_pre_asignacion}?comentarios=${encodeURIComponent(comentarios)}`,
                formData
            );

            if (res.data.status === "success") {
                toast.success(res.data.message);
                setEditMode(false);
                setComentarios("");
                historialRef.current?.reload();
            }

            setEditMode(false);
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const asignar_viaje = async () => {
        try {
            setLoading(true);
            const res = await odooApi.post(`/preasignacion_equipo/asignar_viaje/${id_pre_asignacion}`);
            if (res.data.status === "success") toast.success(res.data.message);
            historialRef.current?.reload();
            getData();

        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const cambiar_estado = async (estado) => {
        try {
            setLoading(true);
            const res = await odooApi.patch(`/preasignacion_equipo/estado/${id_pre_asignacion}?estado=${estado}&comentario="Se reabrió esta asignación de equipo."`);
            if (res.data.status === "success") toast.success(res.data.message);
            getData();
            historialRef.current?.reload();

        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const getData = async () => {
        if (!id_pre_asignacion) return;

        try {
            setLoading(true);
            const res = await odooApi.get(`/preasignacion_equipo/${id_pre_asignacion}`);
            setFormData(res.data);
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const confirmarEquipoViaje = async () => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Se enviará la información al viaje",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            await asignar_viaje();
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => onOpenChange(false)} maxWidth="xl" fullWidth>
            <DialogTitle>Asignación de equipo</DialogTitle>

            {isLoading && (
                <Progress isIndeterminate size='sm'></Progress>
            )}

            <DialogContent dividers>

                <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ flex: 2 }}>

                        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>

                            {id_pre_asignacion == null && (
                                <Button
                                    color="success"
                                    isDisabled={isLoading}
                                    onPress={guardar}
                                    className='text-white'
                                    radius='full'
                                >
                                    Guardar asignación
                                </Button>
                            )}

                            {id_pre_asignacion != null && !isEditMode && formData.estado !== 'asignado_viaje' && (
                                <>
                                    <Button
                                        color="primary"
                                        onPress={() => setEditMode(true)}
                                        radius='full'
                                    >
                                        Editar
                                    </Button>

                                    <Button
                                        radius='full'
                                        color="danger"
                                        isDisabled={isLoading}
                                        onPress={confirmarEquipoViaje}
                                    >
                                        Asignar a viaje
                                    </Button>
                                </>
                            )}

                            {id_pre_asignacion != null && isEditMode && (
                                <Button
                                    color="warning"
                                    isDisabled={isLoading}
                                    onPress={actualizar}
                                    radius='full'
                                    className='text-white'
                                >
                                    Actualizar asignación
                                </Button>
                            )}

                            {formData.estado == 'asignado_viaje' && (
                                <Button
                                    color="primary"
                                    isDisabled={isLoading}
                                    onPress={() => cambiar_estado("borrador")}
                                    radius='full'
                                    className='text-white'
                                >
                                    Reabrir asignación
                                </Button>
                            )}
                        </div>

                        <div className="w-full flex flex-row flex-wrap gap-4 mt-3">

                            <SelectFlota
                                label="Remolque 1"
                                name="trailer1_id"
                                onChange={handleSelectChange}
                                value={formData.trailer1_id}
                                tipo="trailer"
                                disabled={isDisabled}
                            />

                            <SelectFlota
                                label="Remolque 2"
                                name="trailer2_id"
                                onChange={handleSelectChange}
                                value={formData.trailer2_id}
                                tipo="trailer"
                                disabled={isDisabled}
                            />

                            <SelectFlota
                                label="Dolly"
                                name="dolly_id"
                                onChange={handleSelectChange}
                                value={formData.dolly_id}
                                tipo="dolly"
                                disabled={isDisabled}
                            />

                            <SelectFlota
                                label="Motogenerador 1"
                                name="motogenerador1_id"
                                onChange={handleSelectChange}
                                value={formData.motogenerador1_id}
                                tipo="other"
                                disabled={isDisabled}
                            />

                            <SelectFlota
                                label="Motogenerador 2"
                                name="motogenerador2_id"
                                onChange={handleSelectChange}
                                value={formData.motogenerador2_id}
                                tipo="other"
                                disabled={isDisabled}
                            />

                            <Textarea
                                label="Comentarios"
                                value={comentarios}
                                variant={isDisabled ? "flat" : "bordered"}
                                isDisabled={isDisabled}
                                onChange={(e) => setComentarios(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{
                        flex: 2,
                        height: 600,
                        overflowY: "auto",
                        paddingRight: "5px"
                    }}>
                        <HistorialCambioEquipo ref={historialRef} id_pre_asignacion={id_pre_asignacion} />
                    </div>
                </div>

            </DialogContent>

            <DialogActions>
                <MUIButton color="error" onClick={() => onOpenChange(false)}>
                    Cerrar
                </MUIButton>
            </DialogActions>
        </Dialog>
    );
};

export default FormularioAsignacionEquipo;
