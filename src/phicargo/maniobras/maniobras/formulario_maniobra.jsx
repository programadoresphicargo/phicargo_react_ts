import React, { useState, useEffect, useCallback } from 'react';
import MyComponent from './selects_flota';
import axios from 'axios';
import SelectOperador from './select_operador';
import ManiobraContenedores from './añadir_contenedor/maniobra_contenedores';
import { User } from "@nextui-org/react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { Button } from '@nextui-org/react';
import AutocompleteManager from './correos_electronicos/correos_electronicos';
import CancelarManiobraDialog from './cancelar_maniobra';
import { toast } from 'react-toastify';
import { Card, CardBody } from '@nextui-org/react';
import SelectTerminal from './select_terminal';
import { Autocomplete, Container, filledInputClasses } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PanelEstatus from './envio_estatus/panel';
import { useAuthContext } from '@/phicargo/modules/auth/hooks';
import EstatusHistorialManiobras from '../reportes_estatus/estatus';
const { VITE_PHIDES_API_URL } = import.meta.env;

const fieldValidations = {
    id_terminal: { required: true, message: 'El campo Terminal es requerido' },
    tipo_maniobra: { required: true, message: 'El campo Tipo de Maniobra es requerido' },
    inicio_programado: { required: true, message: 'El campo Inicio Programado es requerido' },
    correos_ligados: { required: true, message: 'Los correos son requeridos' }
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Formulariomaniobra = ({ show, handleClose, id_maniobra, id_cp, id_cliente }) => {

    const { session } = useAuthContext();
    const [formDisabled, setFormDisabled] = useState(true);
    const [htmlContent, setHtmlContent] = useState('');
    const [values, setValues] = useState({ addedValues: [], removedValues: [] });
    const [Loading, setLoading] = useState(false);
    const controller = new AbortController();

    const handleValuesChange = (newValues) => {
        setValues(newValues);
        setFormData((prevFormData) => ({
            ...prevFormData,
            correos_ligados: newValues.addedValues,
            correos_desligados: newValues.removedValues,
        }));
    };

    const cargarHistorial = useCallback(() => {
        axios
            .post(VITE_PHIDES_API_URL + "/modulo_maniobras/panel_envio/historial/historial.php?id_maniobra=" + id_maniobra, { signal: controller.signal })
            .then((response) => {
                setHtmlContent(response.data);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Error al cargar el historial:', error);
                }
            });
    }, [id_maniobra]);

    useEffect(() => {
        if (show) {
            cargarHistorial();
        }

        return () => {
            controller.abort();
        };
    }, [show, cargarHistorial]);

    const [buttonsVisibility, setButtonsVisibility] = useState({
        registrar: false,
        cancelar: false,
        editar_maniobra: false,
        iniciar: false,
        finalizar: false,
        enviar_estatus: false,
        reactivar: false
    });

    const toggleButtonsVisibility = (variable) => {
        const newVisibility = {};

        if (variable === 'borrador') {
            newVisibility.registrar = false;
            newVisibility.editar_maniobra = true;
            newVisibility.cancelar = true;
            newVisibility.iniciar = true;
            newVisibility.finalizar = false;
            newVisibility.correos = true;
            newVisibility.enviar_estatus = false;
        } else if (variable === 'cancelada') {
            newVisibility.registrar = false;
            newVisibility.cancelar = false;
            newVisibility.iniciar = false;
            newVisibility.finalizar = false;
            newVisibility.correos = false;
            newVisibility.enviar_estatus = false;
        } else if (variable === 'registrar') {
            newVisibility.registrar = true;
            newVisibility.cancelar = false;
            newVisibility.iniciar = false;
            newVisibility.finalizar = false;
            newVisibility.correos = false;
            newVisibility.enviar_estatus = false;
        } else if (variable === 'editar') {
            newVisibility.registrar = false;
            newVisibility.editar_maniobra = false;
            newVisibility.guardar_maniobra = true;
            newVisibility.cancelar = false;
            newVisibility.iniciar = false;
            newVisibility.finalizar = false;
            newVisibility.correos = false;
            newVisibility.enviar_estatus = false;
        } else if (variable === 'finalizada') {
            newVisibility.registrar = false;
            newVisibility.editar_maniobra = false;
            newVisibility.guardar_maniobra = false;
            newVisibility.cancelar = false;
            newVisibility.iniciar = false;
            newVisibility.finalizar = false;
            newVisibility.reactivar = true;
            newVisibility.correos = false;
            newVisibility.enviar_estatus = false;
        } else if (variable === 'activa') {
            newVisibility.registrar = false;
            newVisibility.editar_maniobra = false;
            newVisibility.guardar_maniobra = false;
            newVisibility.cancelar = false;
            newVisibility.iniciar = false;
            newVisibility.finalizar = true;
            newVisibility.reactivar = false;
            newVisibility.correos = false;
            newVisibility.enviar_estatus = true;
        }

        setButtonsVisibility(newVisibility);
    };

    const toggleForm = () => {
        setFormDisabled(false);
        toggleButtonsVisibility('editar');
    };

    const options_tipo_maniobra = [
        { value: 'ingreso', label: 'Ingreso' },
        { value: 'retiro', label: 'Retiro' },
        { value: 'local', label: 'Viaje local' },
        { value: 'resguardo', label: 'resguardo' },
        { value: 'pesaje', label: 'pesaje' }
    ];

    const [formData, setFormData] = useState({
        id_maniobra: id_maniobra,
        id_usuario: session.user.id,
        id_cp: id_cp,
        id_cliente: id_cliente,
        id_terminal: '',
        tipo_maniobra: '',
        operador_id: '',
        vehicle_id: '',
        trailer1_id: '',
        trailer2_id: '',
        dolly_id: '',
        inicio_programado: '',
        usuario_registro: '',
        usuario_activo: '',
        usuario_finalizo: '',
        estado_maniobra: '',
        correos_ligados: [],
        correos_desligados: []
    });

    useEffect(() => {
        if (id_maniobra) {
            setFormDisabled(true);
            validarCampos();
            axios.get(VITE_PHIDES_API_URL + `/modulo_maniobras/maniobra/get_maniobra.php?id_maniobra=${id_maniobra}`)
                .then((response) => {
                    const data = response.data[0];
                    console.log('datos de maniobra');
                    console.log(data);
                    console.log(data.estado_maniobra);
                    setFormData({
                        id_maniobra: data.id_maniobra || '',
                        id_usuario: session.user.id,
                        id_cp: data.id_cp || '',
                        id_terminal: data.id_terminal || '',
                        tipo_maniobra: data.tipo_maniobra || '',
                        operador_id: data.operador_id || '',
                        vehicle_id: data.vehicle_id || '',
                        trailer1_id: data.trailer1_id || '',
                        trailer2_id: data.trailer2_id || '',
                        dolly_id: data.dolly_id || '',
                        motogenerador_1: data.motogenerador_1 || '',
                        motogenerador_2: data.motogenerador_2 || '',
                        inicio_programado: data.inicio_programado || '',
                        usuario_registro: data.usuarioregistro || '',
                        usuario_activo: data.usuarioactivacion || '',
                        usuario_finalizo: data.usuariofinalizacion || '',
                        estado_maniobra: data.estado_maniobra || '',
                        correos_ligados: [],
                        correos_desligados: []
                    });
                    toggleButtonsVisibility(data.estado_maniobra);
                })
                .catch((error) => {
                    toast.error('Error al obtener datos de maniobra:' + error);
                });
        } else {
            setFormDisabled(false);
            setFormData({
                id_cp: id_cp,
                id_usuario: session.user.id,
                id_terminal: '',
                id_cliente: '',
                tipo_maniobra: '',
                operador_id: '',
                vehicle_id: '',
                trailer1_id: '',
                trailer2_id: '',
                dolly_id: '',
                motogenerador_1: '',
                motogenerador_2: '',
                inicio_programado: '',
                estado_maniobra: '',
                correos_ligados: [],
                correos_desligados: []
            });
            toggleButtonsVisibility('registrar');
        }
    }, [id_maniobra]);

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
        if (formData.correos_ligados.length === 0) {
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

    const validar_form = (e) => {
        e.preventDefault();

        if (validarFormulario()) {
            registrar_maniobra();
        }
    };

    // Función de validación para actualizar maniobra
    const validar_form_actualizar = (e) => {
        e.preventDefault();


        actualizar_maniobra();

    };

    const handleChange = (newValue) => {
        setFormData((prevData) => ({
            ...prevData,
            inicio_programado: newValue.format('YYYY-MM-DD HH:mm'),
        }));
    };

    const handleChangeTipoManiobra = (event, newValue) => {
        const valueToSet = newValue ? newValue.value : null;
        setFormData((prevData) => ({
            ...prevData,
            tipo_maniobra: valueToSet,
        }));
    };

    const handleSelectChange = (selectedOption, name) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: selectedOption ? selectedOption.value : '',
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

    const registrar_maniobra = () => {
        setLoading(true);
        axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/maniobra/registrar_maniobra.php', formData)
            .then((response) => {
                const data = response.data;
                setLoading(false);
                if (data.success) {
                    toast.success('El registro ha sido exitoso.');
                    handleClose();
                } else if (data.error) {
                    toast.error('Error: ' + data.error);
                } else {
                    toast.error('Respuesta inesperada.');
                }
            })
            .catch((error) => {
                console.error('Error en la solicitud:' + error);
                setLoading(false);
                if (error.response) {
                    toast.error('Respuesta de error:' + error.response.data);
                } else if (error.request) {
                    toast.error('No se recibió respuesta del servidor:' + error.request);
                } else {
                    toast.error('Error al configurar la solicitud:' + error.message);
                }
            });
    };

    const actualizar_maniobra = () => {
        setLoading(true);
        axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/maniobra/actualizar_maniobra.php', formData)
            .then((response) => {
                const data = response.data;
                setLoading(false);
                if (data.success) {
                    toast.success('Datos actualizados correctamente.');
                    handleClose();
                    setFormDisabled(true);
                    toggleButtonsVisibility('borrador');
                } else {
                    toast.error('Respuesta inesperada del servidor: ' + data);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error en la solicitud:', error);
                if (error.response) {
                    toast.error('Respuesta de error del servidor:' + error.response.data);
                } else if (error.request) {
                    toast.error('No se recibió respuesta del servidor:' + error.request);
                } else {
                    toast.error('Error al configurar la solicitud:' + error.message);
                }
            });
    };

    const reactivar_maniobra = () => {
        console.log(id_maniobra);
        axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/maniobra/reactivar_maniobra.php', formData)
            .then((response) => {
                if (response.data === 1) {
                    toast.success('El registro ha sido exitoso.');
                    handleClose();
                    toggleButtonsVisibility('borrador');
                } else {
                    toast.error('Respuesta inesperada del servidor:', response.data);
                }
            })
            .catch((error) => {
                console.error('Error en la solicitud:', error);
                if (error.response) {
                    toast.error('Hubo un problema al registrar la maniobra. Código de error: ' + error.response.status);
                } else if (error.request) {
                    toast.error('No se recibió respuesta del servidor:', error.request);
                } else {
                    toast.error('Error al configurar la solicitud:', error.message);
                }
            });
    };

    const comprobar_equipo = () => {
        axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/codigos/comprobar_disponibilidad.php?id_maniobra=' + id_maniobra)
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
            setLoading(true);
            if (result.isConfirmed) {
                // Crear las variables con URLSearchParams
                const postData = new URLSearchParams();
                postData.append('id_maniobra', id_maniobra);
                postData.append('id_usuario', session.user.id);

                axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/maniobra/activar_maniobra.php', postData)
                    .then((response) => {
                        setLoading(false);
                        const data = response.data;
                        if (data.success) {
                            Swal.fire(
                                '¡Activada!',
                                'La maniobra ha sido activada',
                                'success'
                            );
                            enviar_correo(id_maniobra, 255, 'Iniciando maniobra');
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
                axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/maniobra/finalizar_maniobra.php', postData)
                    .then((response) => {
                        const data = response.data;
                        if (data.success) {
                            Swal.fire(
                                '¡Finalizada!',
                                'Maniobra finalizada.',
                                'success'
                            );
                            enviar_correo(id_maniobra, 256, 'Finalizando maniobra');
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

    const enviar_correo = async (id_maniobra, id_estatus, comentarios) => {
        const session = useAuthContext();
        const formData = new FormData();
        formData.append('id_maniobra', id_maniobra);
        formData.append('id_estatus', id_estatus);
        formData.append('comentarios', comentarios);
        formData.append('id_usuario', session.user.id);

        try {
            toast.success('Enviando correo espere...');
            const response = await axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/correos/envio_correo.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const data = response.data;

            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error('Error subiendo el archivo' + error);
        }
    };

    const [openPanelEstatus, setOpenPanelEstatus] = React.useState(false);

    const handleClickOpenPE = () => {
        setOpenPanelEstatus(true);
    };

    const handleClosePE = () => {
        setOpenPanelEstatus(false);
        cargarHistorial();
    };

    return (
        <>
            <PanelEstatus id_maniobra={id_maniobra} open={openPanelEstatus} handleClose={handleClosePE}>
            </PanelEstatus>
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
                <Box sx={{ flexGrow: 1 }} className='bg-soft-secondary'>

                    <AppBar sx={{ position: 'relative' }} elevation={0}>
                        <Toolbar>
                            <Typography sx={{ flex: 1 }} variant="h6" component="div">
                                Maniobra M-{id_maniobra} / {id_cp}
                            </Typography>
                            <Button autoFocus color="inherit" onClick={handleClose}>
                                Cerrar
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <Grid container m={2}>
                        <Grid lg={12} xs={12} m={1}>
                            <Stack spacing={1} direction="row">
                                {buttonsVisibility.registrar && <Button color="primary" onClick={validar_form} disableElevation isLoading={Loading}>Registrar</Button>}
                                {buttonsVisibility.cancelar && <Button color="primary" onClick={handleOpenDialog} disableElevation>Cancelar</Button>}
                                {buttonsVisibility.guardar_maniobra && <Button color="primary" onClick={validar_form_actualizar} disableElevation isLoading={Loading}>Guardar cambios</Button>}
                                {buttonsVisibility.editar_maniobra && <Button color="primary" onClick={toggleForm} disableElevation>Editar formulario</Button>}
                                {buttonsVisibility.iniciar && <Button color="primary" onClick={comprobar_equipo} disableElevation>Iniciar</Button>}
                                {buttonsVisibility.finalizar && <Button color="primary" onClick={finalizar_maniobra} disableElevation>Finalizar</Button>}
                                {buttonsVisibility.enviar_estatus && <Button color="primary" onClick={handleClickOpenPE} disableElevation>Enviar nuevo estatus</Button>}
                                {buttonsVisibility.reactivar && <Button color="primary" onClick={reactivar_maniobra} disableElevation>Reactivar maniobra</Button>}
                            </Stack>
                        </Grid>

                        {Loading && (
                            <Box sx={{ width: '100%' }} visibility={false}>
                                <LinearProgress />
                            </Box>
                        )}

                        <Grid lg={6} xs={12} p={1}>
                            <Card>
                                <CardBody>
                                    <form>
                                        <Grid container spacing={3} p={1}>
                                            <Grid item xs={12} lg={6}>
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
                                            <Grid item xs={12} lg={6}>
                                                <Autocomplete
                                                    id="tipo_maniobra"
                                                    name="tipo_maniobra"
                                                    size="small"
                                                    onChange={handleChangeTipoManiobra}
                                                    value={options_tipo_maniobra.find(option => option.value === formData.tipo_maniobra) || null}
                                                    getOptionLabel={(option) => option.label}
                                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                                    options={options_tipo_maniobra}
                                                    disabled={formDisabled}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Tipo de maniobra"
                                                            variant="outlined"
                                                            disabled={formDisabled}
                                                            error={errors['tipo_maniobra']}
                                                            helperText={errors['tipo_maniobra']}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker
                                                        slotProps={{
                                                            textField: {
                                                                size: 'small', fullWidth: true, error: errors['inicio_programado'],
                                                                helperText: errors['inicio_programado']
                                                            }
                                                        }}
                                                        id="inicio_programado"
                                                        name="inicio_programado"
                                                        label="Inicio programado"
                                                        size="small"
                                                        value={dayjs(formData.inicio_programado)}
                                                        disabled={formDisabled}
                                                        onChange={handleChange}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                error={errors['inicio_programado']}
                                                                helperText={errors.inicio_programado}
                                                                size="small"
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={12} lg={6}>
                                                <SelectOperador
                                                    label={'Operador'}
                                                    id={'operador_id'}
                                                    name={'operador_id'}
                                                    onChange={handleSelectChange}
                                                    value={formData.operador_id}
                                                    disabled={formDisabled}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6}>
                                                <MyComponent
                                                    label={'Vehiculo'}
                                                    id={'vehicle_id'}
                                                    name={'vehicle_id'}
                                                    onChange={handleSelectChange}
                                                    value={formData.vehicle_id}
                                                    tipo={'tractor'}
                                                    disabled={formDisabled}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6}>
                                                <MyComponent
                                                    label={'Remolque 1'}
                                                    id={'trailer1_id'}
                                                    name={'trailer1_id'}
                                                    onChange={handleSelectChange}
                                                    value={formData.trailer1_id}
                                                    tipo={'trailer'}
                                                    disabled={formDisabled}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6}>
                                                <MyComponent
                                                    label={'Remolque 2'}
                                                    id={'trailer2_id'}
                                                    name={'trailer2_id'}
                                                    onChange={handleSelectChange}
                                                    value={formData.trailer2_id}
                                                    tipo={'trailer'}
                                                    disabled={formDisabled}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6}>
                                                <MyComponent
                                                    label={'Dolly'}
                                                    id={'dolly_id'}
                                                    name={'dolly_id'}
                                                    onChange={handleSelectChange}
                                                    value={formData.dolly_id}
                                                    tipo={'dolly'}
                                                    disabled={formDisabled}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6}>
                                                <MyComponent
                                                    label={'Motogenerador 1'}
                                                    id={'motogenerador_1'}
                                                    name={'motogenerador_1'}
                                                    onChange={handleSelectChange}
                                                    value={formData.motogenerador_1}
                                                    tipo={'other'}
                                                    disabled={formDisabled}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6}>
                                                <MyComponent
                                                    label={'Motogenerador 2'}
                                                    id={'motogenerador_2'}
                                                    name={'motogenerador_2'}
                                                    onChange={handleSelectChange}
                                                    value={formData.motogenerador_2}
                                                    tipo={'other'}
                                                    disabled={formDisabled}
                                                />
                                            </Grid>
                                        </Grid>
                                    </form>
                                </CardBody>
                            </Card>

                            {id_maniobra != null ? (
                                <div className='mt-4'>
                                    <ManiobraContenedores
                                        id_maniobra={id_maniobra} />
                                </div>
                            ) : ''}
                        </Grid>

                        <Grid xs={12} lg={6} p={1}>
                            {formData.estado_maniobra != null ? (
                                <Card elevation={0}>
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

                                        <AutocompleteManager onValuesChange={handleValuesChange} id_maniobra={id_maniobra} id_cliente={id_cliente} disabled={formDisabled} />

                                        <div className="flex gap-4 items-center mt-5">
                                            {formData.usuario_activo !== '' && (
                                                <User
                                                    name="Iniciada por"
                                                    isBordered color="primary"
                                                    description={formData.usuario_activo}
                                                    avatarProps={{
                                                        src: ""
                                                    }}
                                                />
                                            )}
                                            {formData.usuario_finalizo !== '' && (
                                                <User
                                                    name="Finalizada por"
                                                    description={formData.usuario_finalizo}
                                                    avatarProps={{
                                                        src: ""
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
                </Box>
            </Dialog >
        </>
    );
};

export default Formulariomaniobra;
