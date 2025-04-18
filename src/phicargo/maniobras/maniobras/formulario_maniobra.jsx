import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { Card, CardBody } from "@heroui/react";
import { CardHeader, Divider, User } from "@heroui/react";
import { Container, filledInputClasses } from '@mui/material';
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
import ManiobraContenedores from './añadir_contenedor/maniobra_contenedores';
import { ManiobraContext } from '../context/viajeContext';
import MyComponent from './selects_flota';
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

    const { setIDManiobra, setIDCliente, addedValues, setAddedValues, removedValues, setRemovedValues, formData, setFormData, formDisabled, setFormDisabled } = useContext(ManiobraContext);

    const { session } = useAuthContext();
    const [Loading, setLoading] = useState(false);
    const controller = new AbortController();
    const [value, setValue] = React.useState('1');
    setIDCliente(id_cliente);

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

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
        { key: 'ingreso', label: 'Ingreso' },
        { key: 'retiro', label: 'Retiro' },
        { key: 'local', label: 'Viaje local' },
        { key: 'resguardo', label: 'resguardo' },
        { key: 'pesaje', label: 'pesaje' }
    ];

    const fetchCorreosLigados = async (id_maniobra) => {
        try {
            const response = await odooApi.get(`/maniobras/correos/ligados/${id_maniobra}`);
            const correos = response.data;
            console.log(correos);

            setFormData(prevFormData => ({
                ...prevFormData,
                correos_ligados: correos,
                correos_desligados: [],
            }));
        } catch (error) {
            console.error('Error al obtener los correos ligados:', error.message || error);
        }
    };


    useEffect(() => {
        if (id_maniobra) {
            setFormDisabled(true);
            setIDManiobra(id_maniobra);

            // Hacer ambas peticiones en paralelo
            Promise.all([
                odooApi.get(`/maniobras/by_id/${id_maniobra}`),
                odooApi.get(`/maniobras/correos/ligados/${id_maniobra}`)
            ])
                .then(([maniobraRes, correosRes]) => {
                    const data = maniobraRes.data || {};
                    const correos = correosRes.data || [];

                    console.log('Datos de maniobra:', data);
                    console.log('Estado maniobra:', data.estado_maniobra);
                    console.log('Correos ligados:', correos);

                    // Actualizar el estado con todos los datos obtenidos
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
                        correos_ligados: correos,
                        correos_desligados: [],
                        comentarios: data.comentarios || '',
                    });

                    toggleButtonsVisibility(data.estado_maniobra);
                })
                .catch(error => {
                    console.error('Error al obtener datos de maniobra:', error);
                    toast.error('Error al obtener datos de maniobra.');
                });
        } else {
            setIDManiobra(0);
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
                correos_desligados: [],
                comentarios: ''
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

    const handleChangeComentarios = (newValue) => {
        setFormData((prevData) => ({
            ...prevData,
            comentarios: newValue,
        }));
    };

    const handleSelectChange = (selectedOption, name) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: selectedOption ? selectedOption : '',
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

    const actualizar_maniobra = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${VITE_PHIDES_API_URL}/modulo_maniobras/maniobra/actualizar_maniobra.php`, formData);
            setLoading(false);

            const { success, message } = response.data;

            if (success) {
                toast.success('Datos actualizados correctamente.');
                handleClose();
                setFormDisabled(true);
                toggleButtonsVisibility('borrador');

                // Reiniciar solo correos ligados y desligados
                setFormData(prevFormData => ({
                    ...prevFormData,
                    correos_ligados: [],
                    correos_desligados: [],
                }));
            } else {
                toast.error(`Error en la actualización: ${message || 'Respuesta inesperada del servidor'}`);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error en la solicitud:', error);

            if (error.response) {
                toast.error(`Error del servidor: ${error.response.data}`);
            } else if (error.request) {
                toast.error('No se recibió respuesta del servidor.');
            } else {
                toast.error(`Error en la solicitud: ${error.message}`);
            }
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
                console.log(formData.id_maniobra);
                odooApi.get('/maniobras/reactivar/' + formData.id_maniobra)
                    .then((response) => {
                        if (response.data.status === 'success') {
                            toast.success(response.data.message);
                            handleClose();
                            toggleButtonsVisibility('borrador');
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
            if (result.isConfirmed) {
                setLoading(true);
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

            <CorreosLigadosManiobra open={openCL} handleClose={handleCloseCL}></CorreosLigadosManiobra>

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
                            <Typography sx={{ flex: 1 }}>
                                Maniobra M-{id_maniobra} / {id_cp}
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

                    <Box sx={{ width: '100%' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderColor: 'divider', backgroundColor: '#002887', color: 'white' }}>
                                <TabList onChange={handleChangeTab}
                                    textColor="inherit"
                                    sx={{
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: 'white',
                                            height: '3px',
                                        }
                                    }}>
                                    <Tab label="Formulario" value="1" />
                                    <Tab label="Documentación" value="2" />
                                </TabList>
                            </Box>

                            <TabPanel value="1">

                                <Grid container mb={2}>
                                    <Grid size={12}>
                                        <Stack spacing={1} direction="row" className='mb-4'>
                                            {buttonsVisibility.registrar && <Button color="primary" onPress={validar_form} isLoading={Loading}>Registrar</Button>}
                                            {buttonsVisibility.cancelar && <Button onPress={handleOpenDialog} color="danger" startContent={<i class="bi bi-x-circle"></i>}>Cancelar</Button>}
                                            {buttonsVisibility.guardar_maniobra && <Button color="success" onPress={validar_form_actualizar} isLoading={Loading} className='text-white' startContent={<i class="bi bi-floppy"></i>}>Guardar cambios</Button>}
                                            {buttonsVisibility.editar_maniobra && <Button color="primary" onPress={toggleForm} startContent={<i class="bi bi-pen"></i>}>Editar</Button>}
                                            {buttonsVisibility.iniciar && <Button color="success" onPress={comprobar_equipo} className='text-white' startContent={<i class="bi bi-play-fill"></i>}>Iniciar</Button>}
                                            {buttonsVisibility.finalizar && <Button onPress={finalizar_maniobra} color="danger" startContent={<i class="bi bi-stop-fill"></i>}>Finalizar</Button>}
                                            {buttonsVisibility.enviar_estatus && <Button onPress={handleClickOpenPE} color="success" className='text-white' startContent={<i class="bi bi-send-fill"></i>}>Enviar nuevo estatus</Button>}
                                            {buttonsVisibility.reactivar && <Button color="primary" onPress={reactivar_maniobra}>Reactivar maniobra</Button>}
                                            <Button color="primary" onPress={handleClickOpenCL} startContent={<i class="bi bi-envelope-at-fill"></i>}>Correos electronicos</Button>
                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card>
                                            <CardHeader>
                                                Datos de la maniobra
                                            </CardHeader>
                                            <Divider></Divider>
                                            <CardBody>
                                                <Grid container spacing={3}>
                                                    <Grid size={{ xs: 12, md: 6 }}>
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
                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                        <Autocomplete
                                                            isRequired
                                                            label="Tipo de maniobra"
                                                            id="tipo_maniobra"
                                                            name="tipo_maniobra"
                                                            variant='bordered'
                                                            onSelectionChange={(e) => (handleSelectChange(e, 'tipo_maniobra'))}
                                                            defaultItems={options_tipo_maniobra}
                                                            selectedKey={String(formData.tipo_maniobra)}
                                                            isDisabled={formDisabled}
                                                            isInvalid={errors['tipo_maniobra'] ? true : false}
                                                            errorMessage={errors['tipo_maniobra']}
                                                        >
                                                            {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                                                        </Autocomplete>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 6 }}>
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
                                                    <Grid size={{ xs: 12, md: 6 }}>
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
                                                    <Grid size={{ xs: 12, md: 6 }}>
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
                                                    <Grid size={{ xs: 12, md: 6 }}>
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
                                                    <Grid size={{ xs: 12, md: 6 }}>
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
                                                    <Grid size={{ xs: 12, md: 6 }}>
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

                                                    <Grid size={{ xs: 12, md: 12 }}>
                                                        <Textarea
                                                            isDisabled={formDisabled}
                                                            label="Comentarios"
                                                            labelPlacement="outside"
                                                            placeholder="Ingresar un comentario (opcional)"
                                                            variant="bordered"
                                                            value={formData.comentarios}
                                                            onValueChange={handleChangeComentarios}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardBody>
                                        </Card>

                                        {id_maniobra != null ? (
                                            <div className='mt-4'>
                                                <ManiobraContenedores
                                                    id_maniobra={id_maniobra} />
                                            </div>
                                        ) : ''}
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
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

                                                    <div className="flex gap-4 items-center">
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