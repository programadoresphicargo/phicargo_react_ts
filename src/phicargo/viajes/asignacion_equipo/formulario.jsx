import React, { useEffect, useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button as MUIButton,
    TextField,
    Typography,
    Box,
} from "@mui/material";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import SelectFlota from '@/phicargo/maniobras/maniobras/selects_flota';
import HistorialCambioEquipo from './historial';
import Swal from "sweetalert2";
import { Button, Card, CardBody, CardHeader, Divider, Progress, Textarea } from '@heroui/react';
import { Grid } from '@mui/system';

const FormularioAsignacionEquipo = ({ isOpen, onOpenChange, data }) => {

    const historialRef = useRef(null);
    const [isEditMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id_cp: data?.id_cp || null,
    });
    const isDisabled = data?.id_pre_asignacion ? !isEditMode : false;
    const [isLoading, setLoading] = useState(false);
    const [comentarios, setComentarios] = useState("");
    const [filtroActivo, setFiltroActivo] = useState(false);

    const TipoCarga = (waybill_category) => {
        if ([25, 28, 33, 39, 42, 47, 49, 52].includes(waybill_category)) {
            return 'imo';
        } else {
            return 'general';
        }
    };

    useEffect(() => {
        setFormData({ id_cp: data?.id_cp || null });
        setEditMode(false);
        getData();
        setFiltroActivo(true);
    }, [data]);

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
            const detail = error.response?.data?.detail || error.message;
            toast.error("Error: " + detail);
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
                `/preasignacion_equipo/${data?.id_pre_asignacion}?comentarios=${encodeURIComponent(comentarios)}`,
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
            const res = await odooApi.post(`/preasignacion_equipo/asignar_viaje/${data?.id_pre_asignacion}`);
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
            const res = await odooApi.patch(`/preasignacion_equipo/estado/${data?.id_pre_asignacion}?estado=${estado}&comentario="Se reabrió esta asignación de equipo."`);
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
        if (!data?.id_pre_asignacion) return;

        try {
            setLoading(true);
            const res = await odooApi.get(`/preasignacion_equipo/${data?.id_pre_asignacion}`);
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

    const confirmarCambioEstadoPreasignacion = async (estado) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Se reabrira esta preasignación de equipo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            await cambiar_estado(estado);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={() => onOpenChange(false)}
            maxWidth="lg"
            fullWidth
            slotProps={{
                paper: {
                    elevation: 3,
                    sx: {
                        borderRadius: "24px",
                        padding: "8px 0",
                    }
                }
            }}>
            <DialogTitle>Asignación de equipo</DialogTitle>

            {isLoading && (
                <Progress isIndeterminate size='sm'></Progress>
            )}

            <DialogContent dividers>

                <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ flex: 2 }}>

                        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>

                            {data?.id_pre_asignacion == null && (
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

                            {data?.id_pre_asignacion != null && !isEditMode && formData.estado !== 'asignado_viaje' && (
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

                            {data?.id_pre_asignacion != null && isEditMode && (
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
                                    onPress={() => confirmarCambioEstadoPreasignacion("borrador")}
                                    radius='full'
                                    className='text-white'
                                >
                                    Reabrir asignación
                                </Button>
                            )}

                            <Button onClick={() => setFiltroActivo(!filtroActivo)} color={filtroActivo ? 'danger' : 'primary'} radius='full'>
                                {filtroActivo ? "Mostrar todos los equipos" : "Aplicar filtros del viaje"}
                            </Button>
                        </div>

                        <div className="w-full flex flex-col gap-4">

                            {data && (
                                <Card fullWidth>
                                    <CardHeader
                                        style={{
                                            background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>
                                        Información del CP
                                    </CardHeader>
                                    <Divider></Divider>
                                    <CardBody>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: "14px",
                                                fontSize: "14px"
                                            }}
                                        >
                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>CP</div>
                                                <div style={{ fontWeight: 600 }}>{data.name}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>Modo</div>
                                                <div style={{ fontWeight: 600 }}>{data.x_modo_bel}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>Tipo</div>
                                                <div style={{ fontWeight: 600 }}>{data.x_tipo_bel}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>Contenedor</div>
                                                <div style={{ fontWeight: 600 }}>{data.x_reference}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>Ruta</div>
                                                <div style={{ fontWeight: 600 }}>{data.x_ruta_bel}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>Clase</div>
                                                <div style={{ fontWeight: 600 }}>{data.x_clase_bel}</div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}

                            <Card fullWidth>
                                <CardHeader
                                    style={{
                                        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                    Equipo asignado
                                </CardHeader>
                                <Divider></Divider>
                                <CardBody>
                                    <div className="w-full grid grid-cols-2 gap-4">
                                        <SelectFlota
                                            label="Remolque 1"
                                            name="trailer1_id"
                                            onChange={handleSelectChange}
                                            value={formData.trailer1_id}
                                            tipo="trailer"
                                            disabled={isDisabled}
                                            filtroActivo={filtroActivo}
                                            modalidad={data?.x_tipo_bel == 'single' ? 'sencillo' : 'full'}
                                            tipoCarga={TipoCarga(data?.waybill_category)}
                                        />

                                        {data?.x_tipo_bel == 'full' && (
                                            <SelectFlota
                                                label="Remolque 2"
                                                name="trailer2_id"
                                                onChange={handleSelectChange}
                                                value={formData.trailer2_id}
                                                tipo="trailer"
                                                disabled={isDisabled}
                                                filtroActivo={filtroActivo}
                                                modalidad={data?.x_tipo_bel == 'single' ? 'sencillo' : 'full'}
                                                tipoCarga={TipoCarga(data?.waybill_category)}
                                            />
                                        )}

                                        {data?.x_tipo_bel == 'full' && (
                                            <SelectFlota
                                                label="Dolly"
                                                name="dolly_id"
                                                onChange={handleSelectChange}
                                                value={formData.dolly_id}
                                                tipo="dolly"
                                                disabled={isDisabled}
                                            />
                                        )}

                                        <SelectFlota
                                            label="Motogenerador 1"
                                            name="motogenerador1_id"
                                            onChange={handleSelectChange}
                                            value={formData.motogenerador1_id}
                                            tipo="other"
                                            disabled={isDisabled}
                                        />

                                        {data?.x_tipo_bel == 'full' && (
                                            <SelectFlota
                                                label="Motogenerador 2"
                                                name="motogenerador2_id"
                                                onChange={handleSelectChange}
                                                value={formData.motogenerador2_id}
                                                tipo="other"
                                                disabled={isDisabled}
                                            />
                                        )}

                                        <Textarea
                                            label="Comentarios"
                                            value={comentarios}
                                            variant={isDisabled ? "flat" : "bordered"}
                                            isDisabled={isDisabled}
                                            onChange={(e) => setComentarios(e.target.value)}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                    <div style={{
                        flex: 2,
                        height: 600,
                        overflowY: "auto",
                        paddingRight: "5px"
                    }}>
                        <HistorialCambioEquipo ref={historialRef} id_pre_asignacion={data?.id_pre_asignacion} />
                    </div>
                </div>

            </DialogContent>

            <DialogActions>
                <MUIButton color="error" onClick={() => onOpenChange(false)}>
                    Cerrar
                </MUIButton>
            </DialogActions>
        </Dialog >
    );
};

export default FormularioAsignacionEquipo;
