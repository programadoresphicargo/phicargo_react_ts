import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import ManiobraContenedores from './añadir_contenedor/maniobra_contenedores';
import { User } from "@nextui-org/react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { Button } from '@nextui-org/react';
import AutocompleteManager from './correos_electronicos/correos_electronicos';
import { toast } from 'react-toastify';
import { Card, CardBody } from '@nextui-org/react';
import { Container, filledInputClasses } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useAuthContext } from '@/phicargo/modules/auth/hooks';
import EstatusHistorialManiobras from '../reportes_estatus/estatus';
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import CostosExtrasContenedores from './añadir_contenedor/maniobra_contenedores';
import { CostosExtrasContext } from '../context/context';
import ServiciosAplicadosCE from './costos_aplicados/costos_aplicados';
import FormCE from './form';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FormularioCostoExtra = ({ show, handleClose }) => {

    const { id_folio, CartasPorte, CartasPorteEliminadas, CostosExtras, setCostosExtras, CostosExtrasEliminados, setCostosExtrasEliminados, formData, setFormData, DisabledForm, setDisabledForm } = useContext(CostosExtrasContext);
    const [Loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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

    useEffect(() => {
        if (id_folio) {
            odooApi.get(`/folios_costos_extras/get_by_id/${id_folio}`)
                .then((response) => {
                    if (response.data.length > 0) {
                        setIsEditing(false);
                        const data = response.data[0];
                        setFormData({
                            id_folio: data.id_folio,
                            ref_factura: data.ref_factura || null,
                            status: data.status || null,
                        });
                        setDisabledForm(true);
                    } else {
                        console.warn('No se encontraron datos para id_folio:', id_folio);
                        setFormData({});
                        setDisabledForm(false);
                    }
                })
                .catch((error) => {
                    console.error('Error al obtener datos:', error);
                    toast.error(`Error al obtener datos de maniobra: ${error.response?.data?.message || error.message}`);
                });
        } else {
            setFormData({
                id_folio: null,
                ref_factura: null,
                status: null,
                facturado: false,
            });
            setDisabledForm(false);
        }
    }, [id_folio]);

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
                    toast.success('El registro ha sido exitoso.');
                    handleClose();
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
                    setIsEditing(false);
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
                odooApi.post('/folios_costos_extras/facturar/' + id_folio)
                    .then(response => {
                        Swal.fire('Facturado', 'El folio ha sido facturado y cerrado.', 'success');
                        handleClose();
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Hubo un problema al cancelar el folio.', 'error');
                    });
            }
        });
    }

    const cancelar_folio = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cancelar este folio?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'Cancelar',
            imageWidth: 150,
            imageHeight: 150,
            imageAlt: 'Imagen de confirmación',
        }).then((result) => {
            if (result.isConfirmed) {
                odooApi.post('/folios_costos_extras/cancelar/' + id_folio)
                    .then(response => {
                        Swal.fire('Cancelado', 'El folio ha sido cancelado.', 'success');
                        handleClose();
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Hubo un problema al cancelar el folio.', 'error');
                    });
            }
        });
    }

    return (
        <>
            <Dialog open={show}
                onClose={handleClose}
                fullScreen
                TransitionComponent={Transition}>
                <Box className='bg-soft-secondary'>
                    <AppBar sx={{ position: 'relative' }} elevation={0}>
                        <Toolbar>
                            <Typography sx={{ flex: 1 }} component="div">
                                CE-{id_folio}
                            </Typography>
                            <Button autoFocus color="inherit" onPress={handleClose}>
                                Cerrar
                            </Button>
                        </Toolbar>
                    </AppBar>

                    {Loading && (
                        <Box sx={{ width: '100%' }} visibility={false}>
                            <LinearProgress />
                        </Box>
                    )}

                    <Grid container className={'p-4'}>
                        <Grid size={8} className='mt-2 mb-2'>
                            <Stack spacing={1} direction="row">
                                {id_folio == null && (
                                    <Button color="primary" size="sm" onPress={registrar_folio} isLoading={Loading}>
                                        Registrar
                                    </Button>
                                )}

                                {formData.status === 'borrador' && (
                                    <Button color="danger" size="sm" onPress={cancelar_folio}>
                                        Cancelar
                                    </Button>
                                )}

                                {formData.status === 'borrador' && (
                                    <Button color="success" size="sm" onPress={facturar_folio} className='text-white'>
                                        Facturar
                                    </Button>
                                )}

                                {formData.status === "borrador" && !isEditing && (
                                    <Button color="primary" size="sm" onPress={() => editar_registro()}>
                                        Editar
                                    </Button>
                                )}

                                {formData.status === "borrador" && isEditing && (
                                    <Button
                                        color="success"
                                        className='text-white'
                                        size="sm"
                                        onPress={() => {
                                            actualizar_folio();
                                        }}
                                        isLoading={Loading}
                                    >
                                        Guardar cambios
                                    </Button>
                                )}

                            </Stack>
                        </Grid>

                        <Grid size={8} className={"m-1"}>
                            <CostosExtrasContenedores></CostosExtrasContenedores>
                        </Grid>

                        <Grid size={3} className={"m-1"}>
                            <FormCE></FormCE>
                        </Grid>

                        <Grid size={12} className={"m-1"}>
                            <ServiciosAplicadosCE></ServiciosAplicadosCE>
                        </Grid>

                    </Grid>
                </Box>
            </Dialog >
        </>
    );
};

export default FormularioCostoExtra;
