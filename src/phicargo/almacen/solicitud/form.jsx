import {
    Input, Progress, Button, Card, CardBody, Textarea, CardHeader, Divider
} from "@heroui/react";
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import EPPSolicitados from "./solicitud_equipo/equipo";
import ViajeEPP from "./viaje/viaje";
import { AppBar, Stack } from "@mui/material";
import { useAlmacen } from "../contexto/contexto";
import HistorialCambios from "./cambios/epps";
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Swal from "sweetalert2";

const SolicitudForm = ({ id_solicitud, open, handleClose, onSaveSuccess }) => {
    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);
    const
        { modoEdicion, setModoEdicion,
            data, setData, epp, setEPP,
            eppAdded, setEPPAdded,
            eppRemoved, setEPPRemoved,
            eppUpdated, setEPPUpdated,
            isDisabled, setDisabled
        } = useAlmacen();

    const fetchData = async () => {
        if (!id_solicitud) return;
        try {
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/solicitudes_equipo/id_solicitud/${id_solicitud}`);
            setData(response.data);
            setEPP(response.data.epp);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setData((prev) => ({
            ...prev,
            observaciones: e,
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (id_solicitud === null) {
                const payload = {
                    data: data,
                    epp: eppAdded
                };

                const response = await odooApi.post('/tms_travel/solicitudes_equipo/', payload);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const payload = {
                    data: data,
                    equipoAdded: eppAdded,
                    equipoRemoved: eppRemoved,
                    equipoUpdated: eppUpdated
                };
                const response = await odooApi.patch(`/tms_travel/solicitudes_equipo/${id_solicitud}`, payload);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            }
            setEPPAdded([]);
            setEPPRemoved([]);
            handleClose();
        } catch (error) {
            toast.error('Error al guardar:', error);
        } finally {
            setSaving(false);
            setModoEdicion(false);
        }
    };

    const cambiarEstado = async (estado) => {
        setSaving(true);
        try {
            const response = await odooApi.put('/tms_travel/solicitudes_equipo/estado/' + estado + '/' + id_solicitud);
            if (response.data.status == 'success') {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
            handleClose();
        } catch (error) {
            toast.error('Error al guardar:', error);
        } finally {
            setSaving(false);
        }
    };

    const confirmar = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar, este equipo se marcará como entregado y se descontará del inventario disponible.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
        });

        if (result.isConfirmed) {
            setSaving(true);
            try {
                setLoading(true);
                const response = await odooApi.get('/tms_travel/solicitudes_equipo/confirmar/' + id_solicitud);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                    fetchData();
                    handleClose();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error('Error al guardar:', error);
            } finally {
                setLoading(false);
                setSaving(false);
            }
        }
    };

    const entregar = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Entregar equipo al operador',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
        });

        if (result.isConfirmed) {
            setSaving(true);
            setLoading(true);
            try {
                const response = await odooApi.get('/tms_travel/solicitudes_equipo/entregar/' + id_solicitud);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                    fetchData();
                    handleClose();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error('Error al guardar:', error);
            } finally {
                setSaving(false);
                setLoading(false);
            }
        }
    };

    const devolver = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Retornar stock',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
        });

        if (result.isConfirmed) {
            setSaving(true);
            try {
                setLoading(true);
                const response = await odooApi.patch('/tms_travel/solicitudes_equipo/devolver/' + id_solicitud, epp);
                if (response.data.status === 'success') {
                    toast.success(response.data.message);
                    fetchData();
                    handleClose();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                if (error.response) {
                    toast.error("Error del servidor:" + error.response.data);
                } else {
                    console.error("Error de red:", error.message);
                }
            } finally {
                setLoading(false);
                setSaving(false);
            }
        }
    };

    useEffect(() => {
        if (open && id_solicitud !== null) {
            fetchData();
        } else if (open && id_solicitud === null) {
            setData({ nombre: '' });
        }
    }, [open, id_solicitud]);

    const handleEdit = () => {
        setModoEdicion(true);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xl" fullScreen>
            <AppBar elevation={0} sx={{
                background: 'linear-gradient(90deg, #0b2149, #002887)',
                padding: '0 16px',
                position: 'relative'
            }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {id_solicitud ? `Solicitud (ID: ${id_solicitud})` : 'Nueva solicitud :)'}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Toolbar>
            </AppBar>

            {isLoading ? (
                <Progress isIndeterminate size="sm" />
            ) : (

                <DialogContent>

                    <Stack spacing={1} direction="row" className="mb-5">

                        {!id_solicitud && (
                            <Button
                                onPress={handleSave}
                                color="primary"
                                isDisabled={isSaving}
                            >
                                {isSaving ? 'Guardando...' : 'Registrar'}
                            </Button>
                        )}


                        {!modoEdicion && (
                            <Button
                                color="primary"
                                onPress={handleEdit}
                            >
                                Editar
                            </Button>
                        )}

                        {modoEdicion && (
                            <Button
                                onPress={handleSave}
                                color={id_solicitud ? 'success' : 'primary'}
                                isDisabled={isSaving}
                                className={id_solicitud ? 'text-white' : ''}
                            >
                                {isSaving ? 'Guardando...' : id_solicitud ? 'Actualizar' : 'Registrar'}
                            </Button>
                        )}

                        {data?.x_studio_estado === "borrador" && !modoEdicion && (
                            <Button color="success" className="text-white" onPress={() => confirmar()} isLoading={isLoading}>
                                Confirmar
                            </Button>
                        )}
                        {data?.x_studio_estado == "confirmado" && (
                            <Button color='success' className='text-white' onPress={() => entregar()} isLoading={isLoading}>Entregar</Button>
                        )}
                        {data?.x_studio_estado == "entregado" && (
                            <Button color='success' className='text-white' onPress={() => devolver()} isLoading={isLoading}>Devolver a stock</Button>
                        )}
                    </Stack>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 grid grid-cols-1 gap-4">

                            <Card>
                                <CardHeader>
                                    Datos de la solicitud
                                </CardHeader>
                                <Divider></Divider>
                                <CardBody>
                                    <h2><strong>Creado por:</strong> {data?.usuario}</h2>
                                    <h2><strong>Fecha de solicitud:</strong> {data?.create_date}</h2>
                                    <div className="mt-5">
                                        <ViajeEPP id_viaje={data?.x_waybill_id}></ViajeEPP>
                                        <h2><strong>Operador asignado:</strong> {data?.operador}</h2>
                                        <h2><strong>Inicio programado:</strong> {data?.inicio_programado}</h2>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <EPPSolicitados></EPPSolicitados>
                                </CardBody>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>Historial de cambios</CardHeader>
                            <Divider></Divider>
                            <CardBody>
                                <HistorialCambios cambios={data?.mails || []} />
                            </CardBody>
                        </Card>

                    </div>

                </DialogContent>

            )}

            <DialogActions>
                <Button onPress={handleClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SolicitudForm;
