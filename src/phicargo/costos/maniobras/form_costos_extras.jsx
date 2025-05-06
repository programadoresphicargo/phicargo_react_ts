import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Card, CardBody } from "@heroui/react";
import { Container, filledInputClasses } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import CancelFolio from "./cancelar_folio";
import CostosExtrasContenedores from './añadir_contenedor/maniobra_contenedores';
import { CostosExtrasContext } from '../context/context';
import { DateRangePicker } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import FormCE from './form';
import Grid from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import ManiobraContenedores from './añadir_contenedor/maniobra_contenedores';
import ServiciosAplicadosCE from './costos_aplicados/costos_aplicados';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import TimeLineCE from "./linea_tiempo";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { User } from "@heroui/react";
import axios from 'axios';
import dayjs from 'dayjs';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";
import { Link } from "@heroui/react";
const apiUrl = import.meta.env.VITE_ODOO_API_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const FormularioCostoExtra = ({ show, handleClose }) => {

    const { id_folio, setIDFolio, CartasPorte, CartasPorteEliminadas, CostosExtras, setCostosExtras, CostosExtrasEliminados, setCostosExtrasEliminados, formData, setFormData, DisabledForm, setDisabledForm } = useContext(CostosExtrasContext);
    const [Loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [CancelDialog, setCancelDialog] = useState(false);
    const { session } = useAuthContext();

    const openCancelDialog = () => {
        setCancelDialog(true);
    }

    const closeCancelDialog = () => {
        setCancelDialog(false);
    }

    const editar_registro = () => {
        setIsEditing(true);
        setDisabledForm(false);
    }

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            id_folio: id_folio
        }));
    }, [id_folio]);

    const fetchCE = async () => {
        const responseCE = await odooApi.get('/costos_extras/by_id_folio/' + id_folio);
        setCostosExtras(responseCE.data);
    }

    const fetchData = async () => {
        try {
            const response = await odooApi.get(`/folios_costos_extras/get_by_id/${id_folio}`);

            if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
                console.warn('No se encontraron datos para id_folio:', id_folio);
                setFormData({});
                setDisabledForm(false);
                return;
            }

            setIsEditing(false);
            const data = response.data[0];
            console.log(data);

            setFormData({
                id_folio: data.id_folio,
                referencia_factura: data.referencia_factura || null,
                fecha_factura: data.fecha_factura || null,
                estado_factura: data.estado_factura || null,
                status: data.status || null,
                usuario_creacion: data.usuario_creacion || null,
                fecha_creacion: data.fecha_creacion || null,

                usuario_confirmacion: data.usuario_confirmacion || null,
                fecha_confirmacion: data.fecha_confirmacion || null,

                usuario_facturo: data.usuario_facturo || null,
                fecha_facturacion: data.fecha_facturacion || null,

                usuario_cancelacion: data.usuario_cancelacion || null,
                fecha_cancelacion: data.fecha_cancelacion || null,
                motivo_cancelacion: data.motivo_cancelacion || null,
                comentarios_cancelacion: data.comentarios_cancelacion || null,
            });

            fetchCE();
            setDisabledForm(true);
        } catch (error) {
            console.error('Error al obtener datos:', error);
            toast.error(`Error al obtener datos de maniobra: ${error.response?.data?.message || error.message}`);
        }
    };

    useEffect(() => {
        if (!id_folio) {
            setFormData({
                id_folio: null,
                referencia_factura: null,
                status: null,
                facturado: false,
            });
            setDisabledForm(false);
            return;
        }

        fetchData();
    }, [id_folio, odooApi]);

    const validar_folio = () => {
        if (CartasPorte.length === 0) {
            toast.error("Añadir cartas porte");
            return false;
        }

        if (CostosExtras.length === 0) {
            toast.error("Añadir costos extras");
            return false;
        }

        return true;
    };

    const registrar_folio = () => {

        if (!validar_folio()) return;

        const formData2 = {
            data: formData,
            cartas_porte: CartasPorte,
            costos_extras: CostosExtras
        }
        setLoading(true);
        odooApi.post('/folios_costos_extras/create/', formData2)
            .then((response) => {
                const data = response.data;
                setLoading(false);
                if (data.status == "success") {
                    toast.success('El registro ha sido exitoso, Folio: ' + response.data.id_folio);
                    setIDFolio(response.data.id_folio);
                    fetchCE();
                } else if (data.error) {
                    toast.error('Error: ' + data.error);
                } else {
                    toast.error('Respuesta inesperada.' + data.error);
                }
            })
            .catch((error) => {
                console.error('Error en la solicitud:' + error);
                setLoading(false);
                toast.error('Respuesta de error:' + error);
            });
    };

    const actualizar_folio = () => {

        if (!validar_folio()) return;

        const formData2 = {
            data: formData,
            cartas_porte: CartasPorte,
            cartas_porte_eliminadas: CartasPorteEliminadas,
            costos_extras: CostosExtras,
            costos_extras_eliminados: CostosExtrasEliminados,
        };

        setLoading(true);

        odooApi.post('/folios_costos_extras/update/', formData2)
            .then((response) => {
                setLoading(false);
                const data = response.data;

                if (data.status === 'success') {
                    toast.success(data.message);
                    fetchData();
                    setIsEditing(false);
                    setDisabledForm(true);
                } else {
                    toast.error('Respuesta inesperada del servidor: ' + JSON.stringify(data));
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error en la solicitud:', error);

                if (error.response) {
                    toast.error('Error del servidor: ' + JSON.stringify(error.response.data));
                } else if (error.request) {
                    toast.error('No se recibió respuesta del servidor.');
                } else {
                    toast.error('Error en la solicitud: ' + error.message);
                }
            });
    };

    const confirmar_folio = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas confirmar este folio?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
            imageWidth: 150,
            imageHeight: 150,
            imageAlt: 'Imagen de confirmación',
        }).then((result) => {
            if (result.isConfirmed) {
                odooApi.post(`/folios_costos_extras/confirmar/${id_folio}`)
                    .then(response => {
                        if (response.data === 1) {
                            fetchData();
                            toast.success('El folio ha sido confirmado.');
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud:', error);
                        toast.error('Hubo un problema al confirmar el folio.' + error);
                    });
            }
        });
    }

    const facturar_folio = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas facturar este folio?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
            imageWidth: 150,
            imageHeight: 150,
            imageAlt: 'Imagen de confirmación',
        }).then((result) => {
            if (result.isConfirmed) {
                odooApi.post(`/folios_costos_extras/facturar/${id_folio}`)
                    .then(response => {
                        if (response.data?.status === 'error') {
                            toast.error(response.data.message);
                        } else {
                            fetchData();
                            toast.success('El folio ha sido facturado y cerrado.');
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud:', error);
                        toast.error('Hubo un problema al facturar el folio.');
                    });
            }
        });
    }


    return (
        <>
            <Dialog
                fullScreen
                open={show}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar elevation={2}
                    sx={{
                        background: 'linear-gradient(90deg, #0b2149, #002887)',
                        padding: '0 16px',
                        position: 'static'
                    }}>
                    <Toolbar>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            CE-{id_folio}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            Cerrar
                        </Button>
                    </Toolbar>
                </AppBar>

                <Box className='bg-soft-secondary p-3'>
                    {Loading && (
                        <Box sx={{ width: '100%' }} visibility={false}>
                            <LinearProgress />
                        </Box>
                    )}

                    <Grid container>
                        <Grid size={12} className='mt-2 mb-2'>
                            <Card>
                                <CardBody>
                                    <Stack spacing={1} direction="row">

                                        {id_folio == null && (
                                            <Button color="primary" onPress={registrar_folio} isLoading={Loading}>
                                                Registrar
                                            </Button>
                                        )}

                                        {session?.user?.permissions?.includes(151) &&
                                            (formData.status === "borrador" || formData.status === "confirmado") && (
                                                <Button color="danger" onPress={openCancelDialog} startContent={<i className="bi bi-x-circle"></i>}>
                                                    Cancelar
                                                </Button>
                                            )
                                        }

                                        {formData.status === 'borrador' && (
                                            <Button color="success" onPress={confirmar_folio} className='text-white' startContent={<i class="bi bi-check-lg"></i>}>
                                                Confirmar
                                            </Button>
                                        )}

                                        {formData.status === 'confirmado' && (
                                            <Button color="success" onPress={facturar_folio} className='text-white'>
                                                Facturar
                                            </Button>
                                        )}

                                        {(formData.status === "borrador" || formData.status === 'confirmado') && !isEditing && (
                                            <Button color="primary" onPress={() => editar_registro()} startContent={<i class="bi bi-pen"></i>}>
                                                Editar
                                            </Button>
                                        )}

                                        {(formData.status === "borrador" || formData.status === 'confirmado') && isEditing && (
                                            <Button
                                                color="success"
                                                className='text-white'
                                                startContent={<i class="bi bi-floppy"></i>}
                                                onPress={() => {
                                                    actualizar_folio();
                                                }}
                                                isLoading={Loading}
                                            >
                                                Guardar cambios
                                            </Button>
                                        )}

                                        {id_folio != null && (
                                            <Button color="danger" startContent={<i class="bi bi-filetype-pdf"></i>} showAnchorIcon href={`${apiUrl}/tms_travel/estadias/cortes/${id_folio}`} as={Link} isExternal={true}>
                                                Cortes PDF
                                            </Button>
                                        )}

                                    </Stack>
                                </CardBody>
                            </Card>
                        </Grid>

                        <Grid size={12} container spacing={1}>
                            <Grid size={8}>
                                <CostosExtrasContenedores></CostosExtrasContenedores>
                            </Grid>
                            <Grid size={4}>
                                <TimeLineCE></TimeLineCE>
                            </Grid>
                        </Grid>

                        <Grid size={12} className={"mt-2"}>
                            <ServiciosAplicadosCE></ServiciosAplicadosCE>
                        </Grid>

                        <Grid size={6} className={"mt-2"}>
                            <FormCE></FormCE>
                        </Grid>

                    </Grid>
                </Box>
            </Dialog>

            <CancelFolio
                open={CancelDialog}
                onClose={closeCancelDialog}
                fetchData={fetchData}>
            </CancelFolio>

        </>
    );
};

export default FormularioCostoExtra;
