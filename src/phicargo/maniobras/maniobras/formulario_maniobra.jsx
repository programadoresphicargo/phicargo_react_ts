import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { Card, CardBody } from "@heroui/react";
import { CardHeader, Divider, User } from "@heroui/react";
import { Container } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Textarea } from "@heroui/react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AppBar from '@mui/material/AppBar';
import AutocompleteManager from './correos_electronicos/correos_electronicos';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import CancelarManiobraDialog from './cancelar_maniobra';
import CorreosLigadosManiobra from './correos_electronicos/dialog_correos';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Dialog from '@mui/material/Dialog';
import DocumentacionManiobra from '../documentacion/documentacion';
import EstatusHistorialManiobras from '../reportes_estatus/estatus';
import Grid from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ManiobraContenedores from './contenedores/cps_maniobra';
import { ManiobraContext } from '../context/viajeContext';
import SelectFlota from './selects_flota';
import PanelEstatus from './envio_estatus/panel';
import SelectOperador from './select_operador';
import SelectTerminal from './select_terminal';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Toolbar } from '@mui/material';
import { Typography } from '@mui/material';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";
import dayjs from 'dayjs';
import { DatePicker } from "@heroui/react";
import { parseDate, parseDateTime, getLocalTimeZone } from "@internationalized/date";
import { Link } from "@heroui/link";

const apiUrl = import.meta.env.VITE_ODOO_API_URL;

const fieldValidations = {
    id_terminal: { required: true, message: 'El campo Terminal es requerido' },
    tipo_maniobra: { required: true, message: 'El campo Tipo de Maniobra es requerido' },
    inicio_programado: { required: true, message: 'El campo Inicio Programado es requerido' },
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Formulariomaniobra = ({ show, handleClose, id_maniobra, dataCP }) => {

    const {
        formDisabled, setFormDisabled,
        correos_ligados, setCorreosLigados,
        correos_desligados, setCorreosDesligados,
        cps_ligadas, setCpsLigadas,
        cps_desligadas, setCpsDesligadas } = useContext(ManiobraContext);
    const { session } = useAuthContext();
    const [Loading, setLoading] = useState(false);
    const [value, setValue] = React.useState('1');

    function getLocalISOString() {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 19);
    }

    const initialFormData = {
        id_terminal: null,
        tipo_maniobra: null,
        operador_id: null,
        vehicle_id: null,
        trailer1_id: null,
        trailer2_id: null,
        dolly_id: null,
        inicio_programado: getLocalISOString(),
        comentarios: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    const toggleForm = () => {
        setFormDisabled(false);
    };

    const options_tipo_maniobra = [
        { key: 'ingreso', label: 'Ingreso' },
        { key: 'retiro', label: 'Retiro' },
        { key: 'local', label: 'Viaje local' },
        { key: 'resguardo', label: 'resguardo' },
        { key: 'pesaje', label: 'pesaje' }
    ];

    useEffect(() => {
        const loadData = async () => {

            // 👉 SI ES EDICIÓN
            if (id_maniobra) {
                setFormDisabled(true);
                setLoading(true);

                try {
                    const response = await odooApi.get(`/maniobras/${id_maniobra}`);
                    const maniobra = response.data;
                    setFormData(maniobra);
                    setCorreosLigados(maniobra.correos_ligados || []);
                    setCpsLigadas(maniobra.contenedores_ligados || []);
                    setCorreosDesligados([]);
                    setCpsDesligadas([]);
                } catch (error) {
                    toast.error("Error al cargar datos" + error);
                } finally {
                    setLoading(false);
                }

                return;
            }

            // 👉 SI ES NUEVO REGISTRO
            setFormDisabled(false);
            setFormData(initialFormData);
            setCorreosLigados([]);
            setCorreosDesligados([]);
            setCpsLigadas(data && Object.keys(data).length > 0 ? [dataCP] : []);
            setCpsDesligadas([]);
        };

        loadData();
    }, [id_maniobra, show]);

    const [errors, setErrors] = useState({});
    const validateFields = () => {
        let isValid = true;
        let newErrors = {};

        Object.keys(fieldValidations).forEach(field => {
            const validation = fieldValidations[field];
            if (validation.required && !formData[field]) {
                newErrors[field] = validation.message;
                isValid = false;
            }
        });

        return { isValid, newErrors };
    };

    const validarCampos = () => {
        const { isValid, newErrors } = validateFields();
        setErrors(newErrors);
        return isValid;
    };

    // Función para validar los correos
    const comprobacion_correos = () => {
        if (correos_ligados.length === 0) {
            toast.error('Selecciona al menos un correo');
            return false;
        }
        return true;
    };

    // Función para validar trailer2 y dolly
    const comprobacion_trailer_dolly = () => {
        const { trailer2_id, dolly_id } = formData;

        if (trailer2_id && !dolly_id) {
            toast.error('Si seleccionas un segundo remolque (trailer2), debes seleccionar también un dolly.');
            return false;
        }

        if (dolly_id && !trailer2_id) {
            toast.error('Si seleccionas un dolly, debes seleccionar también un segundo remolque (trailer2).');
            return false;
        }

        return true;
    };

    const validarFormulario = () => {
        return validarCampos() && comprobacion_correos() && comprobacion_trailer_dolly();
    };

    const validar_form = () => {
        if (validarFormulario()) {
            registrar_maniobra();
        }
    };


    const validar_form_actualizar = () => {
        if (validarFormulario()) {
            actualizar_maniobra();
        }
    };

    const handleChange = (newValue) => {
        setFormData((prevData) => ({
            ...prevData,
            inicio_programado: newValue.format('YYYY-MM-DD HH:mm'),
        }));
    };

    const update_inicio_programado = (newValue) => {
        const date = newValue.toDate(getLocalTimeZone());
        const formatted = date.getFullYear() +
            '-' + String(date.getMonth() + 1).padStart(2, '0') +
            '-' + String(date.getDate()).padStart(2, '0') +
            'T' + String(date.getHours()).padStart(2, '0') +
            ':' + String(date.getMinutes()).padStart(2, '0') +
            ':' + String(date.getSeconds()).padStart(2, '0');
        setFormData((prevData) => ({
            ...prevData,
            inicio_programado: formatted,
        }));
        console.log(formatted);
    };

    const handleChangeComentarios = (newValue) => {
        setFormData((prevData) => ({
            ...prevData,
            comentarios: newValue,
        }));
    };

    const handleSelectChange = (selectedOption, name) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: selectedOption ? selectedOption : null,
        }));
        console.log('Datos del formulario actualizados:', formData);
    };

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const registrar_maniobra = async () => {
        setLoading(true);

        try {
            const dataSend = {
                data: formData,
                correos_ligados: correos_ligados,
                cps_ligadas: cps_ligadas
            };

            const response = await odooApi.post('/maniobras/create/', dataSend);
            const data = response.data;

            if (data.status === "success") {
                toast.success(data.message);
                handleClose();
            } else if (data.status === "error") {
                toast.error("Error: " + data.message);
            } else if (data.error) {
                toast.error("Error: " + data.error);
            } else {
                toast.error("Respuesta inesperada del servidor.");
            }

        } catch (error) {
            console.error("Error en la solicitud:", error);

            if (error.response) {
                toast.error("Respuesta de error: " + JSON.stringify(error.response.data));
            } else if (error.request) {
                toast.error("No se recibió respuesta del servidor.");
            } else {
                toast.error("Error al configurar la solicitud: " + error.message);
            }

        } finally {
            setLoading(false);
        }
    };

    const actualizar_maniobra = async () => {
        setLoading(true);

        try {
            const dataSend = {
                data: formData,
                correos_ligados: correos_ligados,
                correos_desligados: correos_desligados,
                cps_ligadas: cps_ligadas,
                cps_desligadas: cps_desligadas
            };

            const response = await odooApi.patch(`/maniobras/${id_maniobra}`, dataSend);

            if (response.data.status === "success") {
                toast.success(response.data.message);
                handleClose();
                setFormDisabled(true);
            } else {
                toast.error("Error en la actualización: Respuesta inesperada del servidor");
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            if (error.response) {
                toast.error(`Error del servidor: ${error.response.data}`);
            } else if (error.request) {
                toast.error('No se recibió respuesta del servidor.');
            } else {
                toast.error(`Error en la solicitud: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const reactivar_maniobra = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas reactivar esta maniobra?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, reactivar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                odooApi.get('/maniobras/reactivar/' + formData.id_maniobra)
                    .then((response) => {
                        if (response.data.status === 'success') {
                            toast.success(response.data.message);
                            handleClose();
                        } else {
                            toast.error('Respuesta inesperada del servidor: ' + response.data.message);
                        }
                    })
                    .catch((error) => {
                        toast.error('Error en la solicitud:' + error);
                        if (error.response) {
                            toast.error('Hubo un problema al registrar la maniobra. Código de error: ' + error.response.status);
                        } else if (error.request) {
                            toast.error('No se recibió respuesta del servidor:', error.request);
                        } else {
                            toast.error('Error al configurar la solicitud: ' + error.message);
                        }
                    });
            }
        });
    };

    const comprobar_equipo = () => {
        toast.info('Comprobando disponibilidad de equipo');
        odooApi.get('/maniobras/comprobar_disponibilidad_equipo/' + id_maniobra)
            .then((response) => {
                const datos = response.data;
                if (Array.isArray(datos) && datos.length > 0) {
                    let mensajesEquipos = '';

                    datos.forEach((item) => {
                        const mensaje = 'Equipo: ' + item.equipo + ' en ' + item.estado + ' : ' + item.referencia;
                        mensajesEquipos += mensaje + '<br>';
                    });

                    Swal.fire({
                        icon: "error",
                        title: "No se puede iniciar esta maniobra, equipos no disponibles.",
                        html: "El equipo asignado para esta maniobra está actualmente en uso. Para activar una nueva maniobra o viaje, primero debes finalizar la maniobra o viaje anterior: <br><br>" + mensajesEquipos,
                    });

                } else {
                    activar_maniobra();
                }
            })
            .catch((error) => {
                console.error('Error en la solicitud:' + error);
                if (error.response) {
                    toast.error('Hubo un problema al registrar la maniobra. Código de error: ' + error.response.status);
                } else if (error.request) {
                    toast.error('No se recibió respuesta del servidor:' + error.request);
                } else {
                    toast.error('Error al configurar la solicitud:' + error.message);
                }
            });
    };

    const activar_maniobra = () => {
        Swal.fire({
            title: 'Activar',
            text: "¿Deseas realmente activar esta maniobra?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'custom-swal',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                const postData = new URLSearchParams();
                postData.append('id_maniobra', id_maniobra);
                postData.append('id_estatus', 255);
                postData.append('id_usuario', session.user.id);

                odooApi.post('/maniobras/reportes_estatus_maniobras/envio_estatus/', postData)
                    .then((response) => {
                        setLoading(false);
                        const data = response.data;
                        if (data.status == "success") {
                            Swal.fire(
                                '¡Activada!',
                                data.message,
                                'success'
                            );
                            handleClose();
                        } else {
                            Swal.fire(
                                'Error',
                                response.data,
                                'error'
                            );
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        Swal.fire(
                            'Error',
                            'Hubo un problema al activar el registro.',
                            'error'
                        );
                    });
            }
        });
    };

    const finalizar_maniobra = () => {

        const postData = new URLSearchParams();
        postData.append('id_maniobra', id_maniobra);
        postData.append('id_estatus', 256);
        postData.append('id_usuario', session.user.id);

        Swal.fire({
            title: 'Finalizar maniobra',
            text: "¿Realmente deseas finalizar esta maniobra?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, finalizar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                odooApi.post('/maniobras/reportes_estatus_maniobras/envio_estatus/', postData)
                    .then((response) => {
                        const data = response.data;
                        if (data.status == "success") {
                            Swal.fire(
                                '¡Finalizada!',
                                data.message,
                                'success'
                            );
                            handleClose();
                        } else {
                            console.error(data.error);
                            Swal.fire(
                                'Error',
                                data.error,
                                'error'
                            );
                        }
                    })
                    .catch((error) => {
                        Swal.fire(
                            'Error',
                            'Hubo un problema al eliminar el registro.',
                            'error'
                        );
                    });
            }
        });
    };

    const [openPanelEstatus, setOpenPanelEstatus] = React.useState(false);

    const handleClickOpenPE = () => {
        setOpenPanelEstatus(true);
    };

    const handleClosePE = () => {
        setOpenPanelEstatus(false);
    };

    const [openCL, setCL] = React.useState(false);

    const handleClickOpenCL = () => {
        setCL(true);
    };

    const handleCloseCL = () => {
        setCL(false);
    };

    return (
        <>
            <PanelEstatus id_maniobra={id_maniobra} open={openPanelEstatus} handleClose={handleClosePE}>
            </PanelEstatus>

            <CorreosLigadosManiobra open={openCL} handleClose={handleCloseCL} id_cliente={dataCP?.id_cliente}></CorreosLigadosManiobra>

            <CancelarManiobraDialog
                open={dialogOpen}
                handleClose={handleCloseDialog}
                id_maniobra={id_maniobra}
            />
            <Dialog open={show}
                onClose={handleClose}
                fullScreen
                TransitionComponent={Transition}
                PaperProps={{
                    style: {
                        zIndex: 1,
                    },
                }}>
                <Box sx={{ flexGrow: 1 }}>

                    <AppBar elevation={2}
                        position="static"
                        sx={{
                            background: 'linear-gradient(90deg, #0b2149, #002887)',
                            padding: '0 16px'
                        }}>
                        <Toolbar>
                            <Typography sx={{ fontFamily: 'Inter' }}>
                                Maniobra M-{id_maniobra} / {dataCP?.id}
                            </Typography>
                            <Button autoFocus color="primary" onPress={handleClose} radius='full'>
                                Cerrar
                            </Button>
                        </Toolbar>
                    </AppBar>

                    {Loading && (
                        <Box sx={{ width: '100%' }} visibility={false}>
                            <LinearProgress />
                        </Box>
                    )}

                    <Box sx={{ width: '100%' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderColor: 'divider', backgroundColor: '#002887', color: 'white' }}>
                                <TabList
                                    onChange={handleChangeTab}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    textColor="inherit"
                                    sx={{
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: 'white',
                                            height: '3px',
                                        }
                                    }}>
                                    <Tab label="Formulario" value="1" sx={{ fontFamily: 'Inter' }} />
                                    <Tab label="Documentación" value="2" sx={{ fontFamily: 'Inter' }} />
                                </TabList>
                            </Box>

                            <TabPanel value="1">

                                <Grid container mb={2} spacing={2}>
                                    <Grid size={12}>
                                        <Stack spacing={1} direction="row" className='mb-4'>
                                            {!id_maniobra &&
                                                <Button color="primary" onPress={validar_form} isLoading={Loading} radius='full'>Registrar</Button>
                                            }
                                            {formData.estado_maniobra == "borrador" && (
                                                <Button onPress={handleOpenDialog} color="danger" startContent={<i class="bi bi-x-circle"></i>} radius='full' isLoading={Loading}>Cancelar</Button>
                                            )}
                                            {!formDisabled && id_maniobra && (
                                                <Button color="success" onPress={validar_form_actualizar} isLoading={Loading} className='text-white' startContent={<i class="bi bi-floppy"></i>} radius='full'>Guardar cambios</Button>
                                            )}
                                            {formData.estado_maniobra == "borrador" && (
                                                <Button color="primary" onPress={toggleForm} startContent={<i class="bi bi-pen"></i>} radius='full' isLoading={Loading}>Editar</Button>
                                            )}
                                            {formData.estado_maniobra == "borrador" && (
                                                <Button color="success" onPress={comprobar_equipo} className='text-white' startContent={<i class="bi bi-play-fill"></i>} radius='full' isLoading={Loading}>Iniciar</Button>
                                            )}
                                            {formData.estado_maniobra == "activa" && (
                                                <Button onPress={finalizar_maniobra} color="danger" startContent={<i class="bi bi-stop-fill"></i>} radius="full" isLoading={Loading}>Finalizar</Button>
                                            )}
                                            {formData.estado_maniobra == "activa" && (
                                                <Button onPress={handleClickOpenPE} color="success" className='text-white' startContent={<i class="bi bi-send-fill"></i>} radius="full" isLoading={Loading}>Enviar nuevo estatus</Button>
                                            )}
                                            {formData.estado_maniobra == "finalizada" && (
                                                <Button color="primary" onPress={reactivar_maniobra} radius='full' isLoading={Loading}>Reactivar maniobra</Button>
                                            )}
                                            <Button color="primary" onPress={handleClickOpenCL} startContent={<i class="bi bi-envelope-at-fill"></i>} radius='full' isLoading={Loading}>Correos electronicos</Button>
                                            {id_maniobra && (
                                                <Button
                                                    radius="full"
                                                    showAnchorIcon
                                                    as={Link}
                                                    isExternal={true}
                                                    color="success"
                                                    href={`${apiUrl}/maniobras/formato_entrega/` + id_maniobra}
                                                    variant="solid"
                                                    className='text-white'
                                                    isLoading={Loading}
                                                >
                                                    Formato de entrega
                                                </Button>)}

                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <Card>
                                            <CardHeader
                                                style={{
                                                    background: 'linear-gradient(90deg, #0b2149, #002887)',
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}>
                                                Datos de la maniobra
                                            </CardHeader>
                                            <Divider></Divider>
                                            <CardBody>
                                                <Grid container spacing={3}>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <SelectTerminal
                                                            label={'Terminal'}
                                                            id="id_terminal"
                                                            name="id_terminal"
                                                            onChange={handleSelectChange}
                                                            value={formData.id_terminal}
                                                            disabled={formDisabled}
                                                            error_terminal={errors['id_terminal']}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <Autocomplete
                                                            isRequired
                                                            label="Tipo de maniobra"
                                                            id="tipo_maniobra"
                                                            name="tipo_maniobra"
                                                            variant={formDisabled ? 'flat' : 'bordered'}
                                                            onSelectionChange={(e) => (handleSelectChange(e, 'tipo_maniobra'))}
                                                            defaultItems={options_tipo_maniobra}
                                                            selectedKey={String(formData.tipo_maniobra)}
                                                            isReadOnly={formDisabled}
                                                            isInvalid={errors['tipo_maniobra'] ? true : false}
                                                            errorMessage={errors['tipo_maniobra']}
                                                        >
                                                            {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                                                        </Autocomplete>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>

                                                        <DatePicker
                                                            firstDayOfWeek="mon"
                                                            label="Inicio programado"
                                                            variant={formDisabled ? 'flat' : 'bordered'}
                                                            showMonthAndYearPickers
                                                            value={parseDateTime(formData.inicio_programado)}
                                                            onChange={update_inicio_programado}
                                                            isReadOnly={formDisabled}
                                                        />
                                                    </Grid>

                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                        <SelectOperador
                                                            label={'Operador'}
                                                            id={'operador_id'}
                                                            name={'operador_id'}
                                                            onChange={handleSelectChange}
                                                            value={formData.operador_id}
                                                            disabled={formDisabled}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                        <SelectFlota
                                                            label={'Vehiculo'}
                                                            id={'vehicle_id'}
                                                            name={'vehicle_id'}
                                                            onChange={handleSelectChange}
                                                            value={formData.vehicle_id}
                                                            tipo={'tractor'}
                                                            disabled={formDisabled}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <SelectFlota
                                                            label={'Remolque 1'}
                                                            id={'trailer1_id'}
                                                            name={'trailer1_id'}
                                                            onChange={handleSelectChange}
                                                            value={formData.trailer1_id}
                                                            tipo={'trailer'}
                                                            disabled={formDisabled}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <SelectFlota
                                                            label={'Remolque 2'}
                                                            id={'trailer2_id'}
                                                            name={'trailer2_id'}
                                                            onChange={handleSelectChange}
                                                            value={formData.trailer2_id}
                                                            tipo={'trailer'}
                                                            disabled={formDisabled}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <SelectFlota
                                                            label={'Dolly'}
                                                            id={'dolly_id'}
                                                            name={'dolly_id'}
                                                            onChange={handleSelectChange}
                                                            value={formData.dolly_id}
                                                            tipo={'dolly'}
                                                            disabled={formDisabled}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                        <SelectFlota
                                                            label={'Motogenerador 1'}
                                                            id={'motogenerador_1'}
                                                            name={'motogenerador_1'}
                                                            onChange={handleSelectChange}
                                                            value={formData.motogenerador_1}
                                                            tipo={'other'}
                                                            disabled={formDisabled}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                        <SelectFlota
                                                            label={'Motogenerador 2'}
                                                            id={'motogenerador_2'}
                                                            name={'motogenerador_2'}
                                                            onChange={handleSelectChange}
                                                            value={formData.motogenerador_2}
                                                            tipo={'other'}
                                                            disabled={formDisabled}
                                                        />
                                                    </Grid>

                                                    <Grid size={{ xs: 12, md: 12 }}>
                                                        <Textarea
                                                            isReadOnly={formDisabled}
                                                            label="Comentarios"
                                                            labelPlacement="outside"
                                                            placeholder="Ingresar un comentario (opcional)"
                                                            variant={formDisabled ? 'flat' : 'bordered'}
                                                            value={formData.comentarios}
                                                            onValueChange={handleChangeComentarios}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardBody>
                                        </Card>

                                        {id_maniobra ? (
                                            <div className='mt-4'>
                                                <ManiobraContenedores
                                                    id_maniobra={id_maniobra} />
                                            </div>
                                        ) : ''}
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {formData.estado_maniobra != null ? (
                                            <Card elevation={0}>
                                                <CardHeader style={{
                                                    background: 'linear-gradient(90deg, #0b2149, #002887)',
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}>
                                                    Movimientos
                                                </CardHeader>
                                                <CardBody>
                                                    <div className='mb-3'>
                                                        {formData.usuario_activo !== '' && (
                                                            <User
                                                                name="Usuario registro"
                                                                isBordered color="primary"
                                                                description={formData.usuario_registro}
                                                                avatarProps={{
                                                                    src: ""
                                                                }}
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="flex gap-4 items-center">
                                                        {formData.usuario_activo && (
                                                            <User
                                                                name="Iniciada por"
                                                                isBordered color="primary"
                                                                description={formData.usuario_activo}
                                                                avatarProps={{
                                                                    src: ""
                                                                }}
                                                            />
                                                        )}
                                                        {formData.usuario_finalizo && (
                                                            <User
                                                                name="Finalizada por"
                                                                description={formData.usuario_finalizo}
                                                                avatarProps={{
                                                                    src: ""
                                                                }}
                                                            />
                                                        )}

                                                        {formData.estado_maniobra == 'cancelada' && (
                                                            <User
                                                                name={"Cancelada por: " + formData.usuario_cancelacion}
                                                                description={formData.fecha_cancelacion + ' Motivo: ' + formData.motivo_cancelacion}
                                                                avatarProps={{
                                                                    src: "",
                                                                    color: "danger"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </CardBody>
                                                <CardBody>
                                                    <EstatusHistorialManiobras id_maniobra={id_maniobra}></EstatusHistorialManiobras>
                                                </CardBody>
                                            </Card>
                                        ) : ''}
                                    </Grid>
                                </Grid>

                            </TabPanel>
                            <TabPanel value="2">
                                <Card>
                                    <CardBody>
                                        <DocumentacionManiobra id_maniobra={id_maniobra}>
                                        </DocumentacionManiobra>
                                    </CardBody>
                                </Card>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Box>
            </Dialog >
        </>
    );
};

export default Formulariomaniobra;