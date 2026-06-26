import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import CancelFolio from "./cancelar_folio";
import CostosExtrasContenedores from './añadir_cp/cps';
import { useCostosExtras } from '../context/context';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import ServiciosAplicadosCE from './costos_aplicados/costos_aplicados';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";
import { Link } from "@heroui/react";
import FormularioArchivos from "@/phicargo/archivos/form";
import { FolioCostoExtra } from "../folios/tabla";
import { useFieldArray, useForm } from "react-hook-form";
import FormCE from "./facturas/form";
import TimeLineCE from "./linea_tiempo";
const apiUrl = import.meta.env.VITE_ODOO_API_URL;

const initialForm: FolioCostoExtra = {
    id_folio: null,
    id_factura: null,
    referencia_factura: null,
    estado_factura: "borrador",
    fecha_factura: null,
    status: "",
    costos_extras: [],
}

const FormularioCostoExtra = ({ show, handleClose, id_folio }: { show: boolean, handleClose: () => void, id_folio: number | null }) => {

    const { control, handleSubmit, reset, watch, setValue } = useForm<FolioCostoExtra>({
        defaultValues: initialForm,
    });

    const {
        fields: fieldsCostosExtras,
        append: appendCostosExtras,
        remove: removeCostosExtras,
        update: updateCostosExtras,
    } = useFieldArray({
        control,
        name: "costos_extras",
        keyName: "fieldId",
    });

    const { CartasPorte, CartasPorteEliminadas, setDisabledForm, setCPS } = useCostosExtras();
    const [Loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [CancelDialog, setCancelDialog] = useState(false);
    const { session } = useAuthContext();
    const [open, setOpen] = useState(false);
    const status = watch("status");

    const openCancelDialog = () => {
        setCancelDialog(true);
    }

    const closeCancelDialog = () => {
        setCancelDialog(false);
        fetchData();
    }

    const editar_registro = () => {
        setIsEditing(true);
        setDisabledForm(false);
    }

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get(`/folios_costos_extras/${id_folio}`);
            reset(response.data);
            setCPS(response.data.cartas_porte);
            setDisabledForm(true);
            setIsEditing(false);
        } catch (error: any) {
            console.error('Error al obtener datos:', error);
            toast.error(`Error al obtener datos: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id_folio) {
            reset(initialForm);
            setDisabledForm(false);
            return;
        }

        fetchData();
    }, [id_folio, show]);

    const validar_folio = () => {
        if (CartasPorte.length === 0) {
            toast.error("Añadir cartas porte");
            return false;
        }

        if (fieldsCostosExtras.length === 0) {
            toast.error("Añadir costos extras");
            return false;
        }

        return true;
    };

    const registrar_folio = (data: FolioCostoExtra) => {

        if (!validar_folio()) return;

        const formData2 = {
            data: data,
            cartas_porte: CartasPorte,
            costos_extras: fieldsCostosExtras
        }
        setLoading(true);
        odooApi.post('/folios_costos_extras/create/', formData2)
            .then((response) => {
                setLoading(false);
                if (response.data.status == "success") {
                    toast.success('El registro ha sido exitoso, Folio: ' + response.data.id_folio);
                    handleClose();
                } else {
                    toast.error('Respuesta inesperada.');
                }
            })
            .catch((error) => {
                console.error('Error en la solicitud:' + error);
                setLoading(false);
                toast.error('Respuesta de error:' + error);
            });
    };

    const actualizar_folio = (data: FolioCostoExtra) => {

        if (!validar_folio()) return;

        const formData2 = {
            data: data,
            cartas_porte: CartasPorte,
            cartas_porte_eliminadas: CartasPorteEliminadas,
            costos_extras: fieldsCostosExtras,
        };

        setLoading(true);

        odooApi.patch('/folios_costos_extras/', formData2)
            .then((response) => {
                setLoading(false);
                const data = response.data;
                if (data.status === 'success') {
                    toast.success(data.message);
                    fetchData();
                    setIsEditing(false);
                    setDisabledForm(true);
                    handleClose();
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
                        <Button autoFocus onPress={handleClose} radius="full" size="sm">
                            Cerrar
                        </Button>
                    </Toolbar>
                </AppBar>

                <Box className='bg-soft-secondary p-3'>
                    {Loading && (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    )}

                    <Grid container>
                        <Grid size={12} className='mt-2 mb-2'>
                            <Card>
                                <CardBody>
                                    <Stack spacing={1} direction="row">

                                        {id_folio == null && (
                                            <Button color="primary" onPress={() => handleSubmit(registrar_folio)()} isLoading={Loading} radius="full">
                                                Registrar
                                            </Button>
                                        )}

                                        {session?.user?.permissions?.includes(151) &&
                                            (status === "borrador" || status === "confirmado") && (
                                                <Button color="danger" onPress={openCancelDialog} startContent={<i className="bi bi-x-circle"></i>} radius="full">
                                                    Cancelar
                                                </Button>
                                            )
                                        }

                                        {status === 'borrador' && (
                                            <Button color="success" onPress={confirmar_folio} className='text-white' startContent={<i className="bi bi-check-lg"></i>} radius="full">
                                                Confirmar
                                            </Button>
                                        )}

                                        {status === 'confirmado' && (
                                            <Button color="success" onPress={facturar_folio} className='text-white' radius="full">
                                                Facturar
                                            </Button>
                                        )}

                                        {(status === "borrador" || status === 'confirmado') && !isEditing && (
                                            <Button color="primary" onPress={() => editar_registro()} startContent={<i className="bi bi-pen"></i>} radius="full">
                                                Editar
                                            </Button>
                                        )}

                                        {(status === "borrador" || status === 'confirmado') && isEditing && (
                                            <Button
                                                radius="full"
                                                color="success"
                                                className='text-white'
                                                startContent={<i className="bi bi-floppy"></i>}
                                                onPress={() => handleSubmit(actualizar_folio)()}
                                                isLoading={Loading}
                                            >
                                                Guardar cambios
                                            </Button>
                                        )}

                                        {id_folio != null && (
                                            <Button radius="full" color="danger" startContent={<i className="bi bi-filetype-pdf"></i>} showAnchorIcon href={`${apiUrl}/tms_travel/estadias/cortes/?id_folio=${id_folio}`} as={Link} isExternal={true}>
                                                Cortes estadías PDF
                                            </Button>
                                        )}

                                        {id_folio != null && (
                                            <Button radius="full" color="success" startContent={<i className="bi bi-filetype-pdf"></i>} className="text-white" onPress={() => setOpen(true)}>
                                                Adjuntos
                                            </Button>
                                        )}

                                    </Stack>
                                </CardBody>
                            </Card>
                        </Grid>

                        <Grid size={12} container spacing={1}>
                            <Grid size={8}>
                                <CostosExtrasContenedores id_folio={id_folio}></CostosExtrasContenedores>
                            </Grid>
                            <Grid size={4}>
                                <TimeLineCE watch={watch}></TimeLineCE>
                            </Grid>
                        </Grid>

                        <Grid size={12} className={"mt-2"}>
                            <ServiciosAplicadosCE
                                fields={fieldsCostosExtras}
                                append={appendCostosExtras}
                                remove={removeCostosExtras}
                                update={updateCostosExtras}
                            />
                        </Grid>

                        <Grid size={6} className={"mt-2"}>
                            <FormCE watch={watch} setValue={setValue}></FormCE>
                        </Grid>

                    </Grid>
                </Box>
            </Dialog>

            {id_folio && (
                <CancelFolio
                    open={CancelDialog}
                    onClose={closeCancelDialog}
                    id_folio={id_folio}
                />
            )}

            {id_folio && (
                <FormularioArchivos
                    open={open}
                    onClose={() => setOpen(false)}
                    ruta={'/folios_costos_extras/'}
                    tabla={'folios_costos_extras'}
                    id={id_folio}
                />
            )}
        </>
    );
};

export default FormularioCostoExtra;
