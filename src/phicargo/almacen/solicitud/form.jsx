import {
    Input, Progress, Button, Card, CardBody, Textarea
} from "@heroui/react";
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import EPPSolicitados from "./epps_solicitud/epps";
import ViajeEPP from "./viaje/viaje";
import { AppBar, Stack } from "@mui/material";
import { useAlmacen } from "../contexto/contexto";
import HistorialCambios from "./cambios/epps";
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

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
            const response = await odooApi.get(`/tms_travel/solicitudes_epp/id_solicitud/${id_solicitud}`);
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

                const response = await odooApi.post('/tms_travel/solicitudes_epp/', payload);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const payload = {
                    data: data,
                    eppAdded: eppAdded,
                    eppRemoved: eppRemoved,
                    eppUpdated: eppUpdated
                };
                const response = await odooApi.put(`/tms_travel/solicitudes_epp/${id_solicitud}`, payload);
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
            const response = await odooApi.put('/tms_travel/solicitudes_epp/estado/' + estado + '/' + id_solicitud);
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
                        {id_solicitud ? `Editar solicitud (ID: ${id_solicitud})` : 'Nueva solicitud :)'}
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
                    <DialogContentText>

                        <Stack spacing={1} direction="row" className="mb-5">
                            {!id_solicitud && (
                                <Button
                                    size="sm"
                                    onPress={handleSave}
                                    color={'primary'}
                                    isDisabled={isSaving}
                                >
                                    {isSaving ? 'Guardando...' : 'Registrar'}
                                </Button>
                            )}
                            {!modoEdicion && (
                                <Button
                                    size="sm"
                                    color="primary"
                                    onPress={handleEdit}
                                >
                                    Editar
                                </Button>
                            )}
                            {modoEdicion && (
                                <Button
                                    size="sm"
                                    onPress={handleSave}
                                    color={id_solicitud ? 'success' : 'primary'}
                                    isDisabled={isSaving}
                                    className={id_solicitud ? 'text-white' : ''}
                                >
                                    {isSaving ? 'Guardando...' : id_solicitud ? 'Actualizar' : 'Registrar'}
                                </Button>
                            )}
                            <Button color='success' className='text-white' onPress={() => cambiarEstado('pendiente')} size="sm">Asignar</Button>
                            <Button color='warning' className="text-white" onPress={() => cambiarEstado('entregado')} size="sm">Devuelto</Button>
                            <Button color='danger' size="sm">Responsiva</Button>
                            <Button color='danger' size="sm">Cancelar</Button>
                        </Stack>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 grid grid-cols-1 gap-4">
                                <Card>
                                    <CardBody>
                                        <ViajeEPP id_viaje={data?.id_viaje}></ViajeEPP>
                                    </CardBody>
                                </Card>

                                <Card>
                                    <CardBody>
                                        <Textarea label="Comentarios"
                                            variant="faded"
                                            value={data?.observaciones}
                                            onValueChange={handleChange}
                                            isDisabled={!modoEdicion}>
                                        </Textarea>
                                    </CardBody>
                                </Card>

                                <Card>
                                    <CardBody>
                                        <EPPSolicitados></EPPSolicitados>
                                    </CardBody>
                                </Card>
                            </div>

                            <Card>
                                <CardBody>
                                    <HistorialCambios cambios={data?.mails || []} />
                                </CardBody>
                            </Card>

                        </div>

                    </DialogContentText>
                </DialogContent>
            )}

            <DialogActions>
                <Button onPress={handleClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SolicitudForm;
