import {
    Progress, Button, Card, CardBody, CardHeader, Divider, NumberInput
} from "@heroui/react";
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import { AppBar, CardContent, Stack } from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { Grid } from '@mui/material';
import EstadoSolicitud from "./estado";
import CancelarSolicitudDialog from "./cancelar";
import { Link } from "@heroui/react";
import { useSolicitudesLlantas } from "./contexto";
import LlantasAsignadas from "./lineas";
import HistorialCambios from "../almacen/solicitud/cambios/epps";
import { Controller, useForm } from "react-hook-form";
const apiUrl = import.meta.env.VITE_ODOO_API_URL;

type SolicitudLlanta = {
    travel_id?: number;
    x_cantidad_solicitada?: number;
    x_operador_id?: number;
    x_waybill_id: number;
};

type SolicitudLlantaLine = {
    x_tire_id: number;
};

type FormValues = {
    data: SolicitudLlanta;
    lineas: SolicitudLlantaLine[];
};

type SolicitudFormProps = {
    id_solicitud: number | null;
    open: boolean;
    handleClose: () => void;
    setID: (id: number) => void;
    travel_id?: number;
};

const SolicitudForm: React.FC<SolicitudFormProps> = ({
    id_solicitud,
    open,
    handleClose,
    setID,
    travel_id
}) => {

    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);
    const [openCancelar, setOpenCancelar] = useState(false);
    const [meta, setMeta] = useState<any>(null);

    const
        {
            modoEdicion,
            setModoEdicion,
            loading, fetchData
        } = useSolicitudesLlantas();

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue
    } = useForm<FormValues>({
        defaultValues: {
            data: {},
            lineas: [],
        },
    });

    const lineas = watch("lineas");

    const onSubmit = async (values: FormValues) => {
        setSaving(true);

        try {

            const formData = new FormData();
            formData.append("payload", JSON.stringify(values));

            if (id_solicitud === null) {

                const response = await odooApi.post(
                    "/solicitudes_llantas/",
                    formData
                );

                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    setID(response.data.data.id);
                    setModoEdicion(false);
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const response = await odooApi.patch(
                    `/solicitudes_llantas/${id_solicitud}`,
                    formData
                );

                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    fetchData(id_solicitud);
                    setModoEdicion(false);
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            toast.error("Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    const changeState = async (estado: string) => {
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
                const response = await odooApi.patch('/solicitudes_llantas/' + id_solicitud + '/status/' + estado);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                    fetchData(id_solicitud);
                } else {
                    toast.error('Error al guarda:' + response.data.message);
                }
            } catch (error: any) {
                const detail = error?.response?.data?.detail;
                if (detail) {
                    toast.error(detail);
                } else {
                    toast.error('Error al guardar');
                }
            } finally {
                setSaving(false);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (open && id_solicitud === null && travel_id) {
            reset({
                data: {
                    travel_id: travel_id ?? undefined
                },
                lineas: []
            });
        }
    }, [open, id_solicitud, travel_id]);

    useEffect(() => {
        if (open && id_solicitud !== null) {
            const fetchData = async () => {
                const response = await odooApi.get(`/solicitudes_llantas/${id_solicitud}`);
                const res = response.data;

                setMeta(response.data);

                reset({
                    data: {
                        travel_id: res.travel_id,
                        x_cantidad_solicitada: res.x_cantidad_solicitada,
                        x_operador_id: res.x_operador_id,
                        x_waybill_id: res.x_waybill_id
                    },
                    lineas: res.lines || []
                });
            };

            fetchData();
        }
    }, [open, id_solicitud]);

    const handleEdit = () => {
        setModoEdicion(true);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="xl"
                fullScreen
                keepMounted>
                <AppBar elevation={0}
                    sx={{
                        background: 'linear-gradient(90deg, #343434, #28282B)',
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
                            {id_solicitud ? `SL-${id_solicitud}` : 'Nueva solicitud'}
                        </Typography>
                        <Button autoFocus onPress={handleClose}>
                            Cerrar
                        </Button>
                    </Toolbar>
                </AppBar>

                {loading && (
                    <Progress isIndeterminate size="sm" />
                )}

                <DialogContent>

                    <Stack spacing={1} direction="row" className="mb-5">

                        {(!modoEdicion && (meta?.x_studio_status === 'borrador' || meta?.x_studio_status === 'entregado')) && (
                            <Button
                                radius="full"
                                color="primary"
                                onPress={handleEdit}>
                                Editar
                            </Button>
                        )}

                        {modoEdicion && (
                            <Button
                                radius="full"
                                onPress={() => handleSubmit(onSubmit)()}
                                color={id_solicitud ? 'success' : 'primary'}
                                isDisabled={isSaving}
                                className={id_solicitud ? 'text-white' : ''}
                            >
                                {isSaving ? 'Guardando...' : id_solicitud ? 'Actualizar' : 'Registrar'}
                            </Button>
                        )}
                        {meta?.x_studio_status === "borrador" && modoEdicion != true && (
                            <Button
                                radius="full"
                                color="success"
                                className="text-white"
                                onPress={() => changeState('confirmado')}
                                isLoading={isLoading}>
                                Confirmar y reservar
                            </Button>
                        )}
                        {meta?.x_studio_status == "confirmado" && (
                            <Button color='warning' className='text-white' onPress={() => changeState('borrador')} isLoading={isLoading} radius="full">Regresar a borrador</Button>
                        )}
                        {meta?.x_studio_status == "confirmado" && (
                            <Button color='success' className='text-white' onPress={() => changeState('entregado')} isLoading={isLoading} radius="full">Entregar</Button>
                        )}
                        {((meta?.x_studio_status == "entregado" || meta?.x_studio_status == "recepcionado_operador")) && (
                            <Button
                                radius="full"
                                color='danger'
                                className='text-white'
                                onPress={() => changeState('cerrado')}
                                isLoading={isLoading}>
                                <i className="bi bi-door-open"></i>
                                Cerrar solicitud
                            </Button>
                        )}
                        {meta?.x_studio_status !== "borrador" && meta?.x_studio_status !== "cancelada" && (
                            <Button
                                radius="full"
                                color="success"
                                as={Link}
                                isExternal={true}
                                className="text-white"
                                href={`${apiUrl}/solicitudes_llantas/formato/${id_solicitud}`}>
                                <i className="bi bi-file-earmark-pdf-fill"></i>
                                Formato de entrega
                            </Button>
                        )}
                        {(!modoEdicion && meta?.x_studio_status == 'borrador') && (
                            <Button
                                radius="full"
                                color="danger"
                                className="text-white"
                                onPress={() => setOpenCancelar(true)}
                                isLoading={isLoading}>
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
                                    background: 'linear-gradient(90deg, #343434, #28282B)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>
                                    Datos de la solicitud
                                </CardHeader>
                                <Divider></Divider>
                                <CardBody>
                                    <Grid container spacing={2}>

                                        <Grid item xs={12} sm={6}>
                                            <span style={{ color: '#666', fontSize: '12px' }}>Carta porte:</span><br />
                                            <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                                {meta?.carta_porte || '---'}
                                            </span>
                                            <input type="hidden" {...register("data.x_waybill_id")} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <span style={{ color: '#666', fontSize: '12px' }}>Operador:</span><br />
                                            <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                                {meta?.operador || '---'}
                                            </span>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <span style={{ color: '#666', fontSize: '12px' }}>Inicio programado:</span><br />
                                            <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                                {meta?.inicio_programado || '---'}
                                            </span>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                control={control}
                                                name="data.x_cantidad_solicitada"
                                                render={({ field }) => (
                                                    <NumberInput
                                                        label="Cantidad solicitada"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        isDisabled={!modoEdicion}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                    </Grid>
                                </CardBody>
                            </Card>

                            <Card className="mt-4">
                                <CardBody>
                                    <LlantasAsignadas meta={meta} lineas={lineas} setLineas={(nuevas) => setValue("lineas", nuevas)}></LlantasAsignadas>
                                </CardBody>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardHeader
                                    style={{
                                        background: 'linear-gradient(90deg, #343434, #28282B)',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>Historial de cambios</CardHeader>
                                <Divider></Divider>

                                {(meta?.x_studio_status == 'cancelada') && (
                                    <Card className="m-3">
                                        <CardHeader className="bg-danger text-white">
                                            Cancelada
                                        </CardHeader>
                                        <Divider></Divider>
                                        <CardContent>
                                            <p>Motivo de cancelación: {meta?.x_motivo_cancelacion}</p>
                                            <p>Comentarios: {meta?.x_comentarios_cancelacion}</p>
                                        </CardContent>
                                    </Card>
                                )}

                                <CardBody>
                                    <HistorialCambios cambios={meta?.mails || []} />
                                </CardBody>
                            </Card>
                        </Grid>
                    </Grid>

                </DialogContent>

            </Dialog >

            <CancelarSolicitudDialog
                open={openCancelar}
                onClose={() => setOpenCancelar(false)}
                id_solicitud={id_solicitud}
            />
        </>
    );
};

export default SolicitudForm;
