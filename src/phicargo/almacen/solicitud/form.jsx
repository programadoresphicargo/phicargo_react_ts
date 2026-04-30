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
import { AppBar, CardContent, Stack } from "@mui/material";
import { useAlmacen } from "../contexto/contexto";
import HistorialCambios from "./cambios/epps";
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Swal from "sweetalert2";
import { Grid } from '@mui/material';
import SelectOperador from "@/phicargo/maniobras/maniobras/select_operador";
import EstadoSolicitud from "./estado";
import CancelarSolicitudDialog from "./cancelar";
import { Select, SelectItem, Link } from "@heroui/react";
import SelectEmpleado from "@/phicargo/descuentos/solicitante";
import UploadFiles from "@/phicargo/onedrive/UploadFiles";

const apiUrl = import.meta.env.VITE_ODOO_API_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SolicitudForm = ({ id_solicitud, open, handleClose, onSaveSuccess, x_tipo, setID, vista, travel_id }) => {
    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);
    const [openCancelar, setOpenCancelar] = useState(false);
    const [fileList, setFileList] = useState([]);

    const
        { modoEdicion, setModoEdicion,
            data, setData,
            isDisabled, setDisabled,
            reservasGlobales, setReservasGlobales,
            lineasGlobales, setLineasGlobales,
            loading, fetchData
        } = useAlmacen();

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

                const formDataToSend = new FormData();

                const payload = {
                    data: data,
                    lineas: lineasGlobales,
                    reservas: reservasGlobales
                };

                formDataToSend.append("payload", JSON.stringify(payload));

                fileList.forEach((file) => {
                    if (file.originFileObj) {
                        formDataToSend.append("files", file.originFileObj);
                    }
                });

                const response = await odooApi.post('/tms_travel/solicitudes_equipo/', formDataToSend);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                    setID(response.data.data.id);
                    setFileList([]);
                } else {
                    toast.error(response.data.message);
                }
            } else {

                const formDataToSend = new FormData();

                const payload = {
                    data: data,
                    lineas: lineasGlobales,
                    reservas: reservasGlobales
                };

                formDataToSend.append("payload", JSON.stringify(payload));

                fileList.forEach((file) => {
                    if (file.originFileObj) {
                        formDataToSend.append("files", file.originFileObj);
                    }
                });

                const response = await odooApi.patch(`/tms_travel/solicitudes_equipo/${id_solicitud}`, formDataToSend);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                    fetchData(id_solicitud);
                    setSaving(false);
                    setModoEdicion(false);
                    setFileList([]);
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            setSaving(false);
            const mensaje = error?.response?.data?.detail || 'Error al guardar';
            toast.error(mensaje);
        } finally {
            setSaving(false);
        }
    };

    const confirmar = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar, este equipo se marcará como reservado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
        });

        if (result.isConfirmed) {
            setSaving(true);
            try {
                setLoading(true);
                const response = await odooApi.patch('/tms_travel/solicitudes_equipo/confirmar/' + id_solicitud);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                    fetchData(id_solicitud);
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

    const reservar = async () => {
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
                const response = await odooApi.patch('/tms_travel/solicitudes_equipo/reservar/' + id_solicitud);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                    fetchData(id_solicitud);
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
                    fetchData(id_solicitud);
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

    const cambiar_borrador = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Regresar solicitud a borrador para hacer cambios',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
        });

        if (result.isConfirmed) {
            setSaving(true);
            setLoading(true);
            try {
                const response = await odooApi.patch('/tms_travel/solicitudes_equipo/borrador/' + id_solicitud);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                    fetchData(id_solicitud);
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
            text: 'Cerrar solicitud',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
        });

        if (result.isConfirmed) {
            setSaving(true);
            try {
                setLoading(true);
                const response = await odooApi.patch('/tms_travel/solicitudes_equipo/devolver/' + id_solicitud);
                if (response.data.status === 'success') {
                    toast.success(response.data.message);
                    fetchData(id_solicitud);
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
            fetchData(id_solicitud);
            setFileList([]);
        } else if (open && id_solicitud === null) {
            setData(prev => ({
                ...prev,
                x_tipo: x_tipo,
                travel_id: travel_id ?? prev?.travel_id
            }));
            setLineasGlobales([]);
            setReservasGlobales([]);
            setFileList([]);
        }
    }, [open, id_solicitud]);

    const handleEdit = () => {
        setModoEdicion(true);
    };

    const handleSelectChange = (key, value) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullScreen slots={{
                transition: Transition,
            }}
                keepMounted>
                <AppBar elevation={0}
                    sx={{
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
                            {id_solicitud ? `Solicitud (ID: ${id_solicitud})` : 'Nueva solicitud'}
                        </Typography>
                        <Button autoFocus color="inherit" onPress={handleClose}>
                            Cerrar
                        </Button>
                    </Toolbar>
                </AppBar>

                {isLoading && (
                    <Progress isIndeterminate size="sm" />
                )}

                <DialogContent>

                    <Stack spacing={1} direction="row" className="mb-5">

                        {(!modoEdicion && (data?.x_studio_estado === 'borrador' || data?.x_studio_estado === 'entregado')) && (
                            <Button
                                radius="full"
                                color="primary"
                                onPress={handleEdit}>
                                <i class="bi bi-pen"></i>
                                Editar
                            </Button>
                        )}

                        {modoEdicion && (
                            <Button
                                radius="full"
                                onPress={handleSave}
                                color={id_solicitud ? 'success' : 'primary'}
                                isDisabled={isSaving}
                                className={id_solicitud ? 'text-white' : ''}
                            >
                                <i class="bi bi-floppy-fill"></i>
                                {isSaving ? 'Guardando...' : id_solicitud ? 'Actualizar' : 'Registrar'}
                            </Button>
                        )}
                        {data?.x_studio_estado === "borrador" && modoEdicion != true && (
                            <Button
                                radius="full"
                                color="success"
                                className="text-white"
                                onPress={() => confirmar()}
                                isLoading={isLoading}>
                                <i class="bi bi-check-circle-fill"></i>
                                Confirmar y reservar
                            </Button>
                        )}
                        {data?.x_studio_estado == "confirmado" && (
                            <Button color='warning' className='text-white' onPress={() => cambiar_borrador()} isLoading={isLoading} radius="full">
                                <i class="bi bi-backspace-fill"></i>
                                Regresar a borrador
                            </Button>
                        )}
                        {data?.x_studio_estado == "confirmado" && (
                            <Button color='success' className='text-white' onPress={() => entregar()} isLoading={isLoading} radius="full">
                                <i class="bi bi-arrow-right-circle-fill"></i>
                                Entregar
                            </Button>
                        )}
                        {((data?.x_studio_estado == "entregado" || data?.x_studio_estado == "recepcionado_operador") && data?.es_asignacion) && (
                            <Button
                                radius="full"
                                color='secondary'
                                className='text-white'
                                onPress={() => devolver()}
                                isLoading={isLoading}>
                                <i class="bi bi-door-open"></i>
                                Cerrar solicitud
                            </Button>
                        )}
                        {data?.x_studio_estado !== "borrador" && data?.x_studio_estado !== "cancelada" && (
                            <Button
                                radius="full"
                                color="success"
                                as={Link}
                                isExternal={true}
                                color="primary"
                                href={`${apiUrl}/tms_travel/solicitudes_equipo/pdf/${id_solicitud}`}>
                                <i class="bi bi-file-earmark-pdf-fill"></i>
                                Formato de entrega
                            </Button>
                        )}
                        {(!modoEdicion && data?.x_studio_estado == 'borrador') && (
                            <Button
                                radius="full"
                                color="danger"
                                className="text-white"
                                onPress={() => setOpenCancelar(true)}
                                isLoading={isLoading}>
                                <i class="bi bi-x-circle-fill"></i>
                                Cancelar
                            </Button>
                        )}

                        <div style={{ marginLeft: 'auto', width: '1000px' }}>
                            <EstadoSolicitud />
                        </div>
                    </Stack>


                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>

                            <Card>
                                <CardHeader style={{
                                    background: 'linear-gradient(90deg, #0b2149, #002887)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>
                                    Datos de la solicitud
                                </CardHeader>
                                <Divider></Divider>
                                <CardBody>
                                    <Grid container spacing={2}>

                                        {vista == 'solicitudes' && (<>

                                            {!travel_id && (
                                                <Grid item xs={12} sm={6}>
                                                    <ViajeEPP id_viaje={data?.x_waybill_id} />
                                                </Grid>
                                            )}

                                            <Grid item xs={12} sm={6}>
                                                <span style={{ color: '#666', fontSize: '12px' }}>Operador:</span><br />
                                                <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                                    {data?.operador || '---'}
                                                </span>
                                            </Grid>

                                            <Grid item xs={12} sm={12}>
                                                <span style={{ color: '#666', fontSize: '12px' }}>Cliente:</span><br />
                                                <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                                    {data?.cliente || '---'}
                                                </span>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <span style={{ color: '#666', fontSize: '12px' }}>Subcliente:</span><br />
                                                <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                                    {data?.subcliente || '---'}
                                                </span>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <span style={{ color: '#666', fontSize: '12px' }}>Dirección:</span><br />
                                                <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                                    {data?.direccion || '---'}
                                                </span>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <span style={{ color: '#666', fontSize: '12px' }}>Inicio programado:</span><br />
                                                <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                                    {data?.inicio_programado || '---'}
                                                </span>
                                            </Grid>
                                        </>
                                        )}

                                        {vista == 'asignaciones' && (<>
                                            <Grid item xs={12} sm={6}>
                                                <SelectEmpleado
                                                    key_name={"x_operador_id"}
                                                    label={"Empleado"}
                                                    isDisabled={!modoEdicion}
                                                    value={data?.x_operador_id}
                                                    setSolicitante={handleSelectChange}>
                                                </SelectEmpleado>
                                            </Grid>
                                        </>
                                        )}

                                        <Grid item xs={12} sm={6}>
                                            <span style={{ color: '#666', fontSize: '12px' }}>Tipo de solicitud:</span><br />
                                            <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                                {data?.x_tipo || '---'}
                                            </span>
                                        </Grid>

                                    </Grid>
                                </CardBody>
                            </Card>

                            <Card className="mt-4">
                                <CardBody>
                                    <EPPSolicitados tipo={x_tipo}></EPPSolicitados>
                                </CardBody>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardHeader
                                    style={{
                                        background: 'linear-gradient(90deg, #0b2149, #002887)',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>Historial de cambios</CardHeader>
                                <Divider></Divider>

                                {(data?.x_studio_estado == 'cancelada') && (
                                    <Card className="m-3">
                                        <CardHeader className="bg-danger text-white">
                                            Cancelada
                                        </CardHeader>
                                        <Divider></Divider>
                                        <CardContent>
                                            <p>Motivo de cancelación: {data?.x_motivo_cancelacion}</p>
                                            <p>Comentarios: {data?.x_comentarios_cancelacion}</p>
                                        </CardContent>
                                    </Card>
                                )}

                                <CardBody>
                                    <HistorialCambios cambios={data?.mails || []} />
                                </CardBody>
                            </Card>

                            <Card className="mt-5">
                                <CardHeader
                                    style={{
                                        background: 'linear-gradient(90deg, #0b2149, #002887)',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>Evidencias
                                </CardHeader>
                                <Divider></Divider>
                                <CardBody>
                                    <UploadFiles fileList={fileList} setFileList={setFileList} id={id_solicitud} tabla={"x_solicitudes_equipo"} disabledFom={!modoEdicion} key={isSaving}></UploadFiles>
                                </CardBody>
                            </Card>

                        </Grid>
                    </Grid>

                </DialogContent>

            </Dialog>

            <CancelarSolicitudDialog
                open={openCancelar}
                onClose={() => setOpenCancelar(false)}
                id_solicitud={id_solicitud}
            />
        </>
    );
};

export default SolicitudForm;
