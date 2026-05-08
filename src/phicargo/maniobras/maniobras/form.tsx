import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { Card, CardBody, Link } from "@heroui/react";
import { CardHeader, Divider, User } from "@heroui/react";
import React, { useContext, useEffect, useState } from 'react';
import { Textarea } from "@heroui/react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import CancelarManiobraDialog from './cancelar_maniobra';
import CorreosLigadosManiobra from './correos_electronicos/dialog_correos';
import Dialog from '@mui/material/Dialog';
import DocumentacionManiobra from '../documentacion/documentacion';
import EstatusHistorialManiobras from '../reportes_estatus/estatus';
import Grid from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import ManiobraContenedores from './contenedores/cps_maniobra';
import { ManiobraContext } from '../context/viajeContext';
import SelectFlota from './selects_flota';
import PanelEstatus from './envio_estatus/panel';
import SelectOperador from './select_operador';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Toolbar } from '@mui/material';
import { Typography } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { DatePicker } from "@heroui/react";
import { parseDateTime, getLocalTimeZone } from "@internationalized/date";
import { reactivarManiobra, registrarManiobra, actualizarManiobra } from './services/maniobras.service';
import { useAuthContext } from '@/modules/auth/hooks';
import { TransitionProps } from '@mui/material/transitions';
import { Controller, useForm } from 'react-hook-form';
import HistorialCambios from '@/phicargo/almacen/solicitud/cambios/epps';

const apiUrl = import.meta.env.VITE_ODOO_API_URL;

type Terminal = {
    id_terminal: number;
    terminal: string;
};

type Driver = {
    id: number;
    name: string;
};

type Flota = {
    id: number;
    name: string;
    x_modalidad: string;
    x_tipo_carga: string;
};

type OptionFlota = {
    key: number;
    label: string;
    x_tipo_carga: string;
    x_modalidad: string;
};

type OptionDriver = {
    key: number;
    label: string;
};

type OptionTerminal = {
    key: number;
    label: string;
};

type ManiobraForm = {
    id_terminal: number | null;
    tipo_maniobra: string | null;
    operador_id: number | null;
    vehicle_id: number | null;
    trailer1_id: number | null;
    trailer2_id: number | null;
    dolly_id: number | null;
    motogenerador_1?: number | null;
    motogenerador_2?: number | null;
    inicio_programado: string;
    comentarios: string;
    estado_maniobra: string;
    usuario_registro: string | null;
    usuario_activo: string | null;
    usuario_finalizo: string | null;
    usuario_cancelo: string | null;
    usuario_cancelacion: string | null;
    fecha_cancelacion: string | null;
    motivo_cancelacion: string | null;
    mails: any[];
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
    show: boolean;
    handleClose: () => void;
    id_maniobra?: number | null;
    dataCP?: any;
};

const Formulariomaniobra: React.FC<Props> = ({
    show,
    handleClose,
    id_maniobra,
    dataCP
}) => {

    const [drivers, setDrivers] = useState<OptionDriver[]>([]);
    const [tractores, setTractores] = useState<OptionFlota[]>([]);
    const [trailers, setTrailers] = useState<OptionFlota[]>([]);
    const [dollies, setDollies] = useState<OptionFlota[]>([]);
    const [terminales, setTerminales] = useState<OptionTerminal[]>([]);
    const [motogeneradores, setMotogeneradores] = useState<OptionFlota[]>([]);
    const [isLoadingDrivers, setLoadingDrivers] = useState(false);
    const [isLoadingFlota, setLoadingFlota] = useState(false);
    const [isLoadingTerminales, setLoadingTerminales] = useState(false);

    const getFlotaByTipo = async (tipo: string): Promise<OptionFlota[]> => {
        const response = await odooApi.get<Flota[]>(`/vehicles/fleet_type/${tipo}`);
        return response.data.map(item => ({
            key: item.id,
            label: item.name,
            x_tipo_carga: item.x_tipo_carga,
            x_modalidad: item.x_modalidad
        }));
    };

    const getDrivers = async () => {
        const response = await odooApi.get<Driver[]>('/drivers/');
        return response.data.map(item => ({
            key: Number(item.id),
            label: item.name,
        }));
    };

    const getTerminales = async () => {
        const response = await odooApi.get<Terminal[]>('/maniobras/terminales/');
        return response.data.map(item => ({
            key: Number(item.id_terminal),
            label: item.terminal,
        }));
    };

    useEffect(() => {
        const cargarTodo = async () => {
            setLoadingFlota(true);
            setLoadingDrivers(true);
            setLoadingTerminales(true);

            try {
                const [
                    tractoresData,
                    trailersData,
                    dolliesData,
                    motogeneradoresData,
                    driversData,
                    terminalesData
                ] = await Promise.all([
                    getFlotaByTipo("tractor"),
                    getFlotaByTipo("trailer"),
                    getFlotaByTipo("dolly"),
                    getFlotaByTipo("other"),
                    getDrivers(),
                    getTerminales()
                ]);

                setTractores(tractoresData);
                setTrailers(trailersData);
                setDollies(dolliesData);
                setMotogeneradores(motogeneradoresData);
                setDrivers(driversData);
                setTerminales(terminalesData)

            } catch (error) {
                console.error(error);
            } finally {
                setLoadingFlota(false);
                setLoadingDrivers(false);
                setLoadingTerminales(false);
            }
        };

        cargarTodo();
    }, []);

    const {
        formDisabled, setFormDisabled,
        correos_ligados, setCorreosLigados,
        correos_desligados, setCorreosDesligados,
        cps_ligadas, setCpsLigadas,
        cps_desligadas, setCpsDesligadas } = useContext(ManiobraContext);

    const { session } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [value, setValue] = React.useState('1');

    function getLocalISOString() {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 19);
    }

    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm<ManiobraForm>({
        defaultValues: {
            id_terminal: null,
            tipo_maniobra: null,
            operador_id: null,
            vehicle_id: null,
            trailer1_id: null,
            trailer2_id: null,
            dolly_id: null,
            inicio_programado: getLocalISOString(),
            comentarios: "",
            estado_maniobra: "borrador"
        },
    });

    const estado = watch("estado_maniobra");
    const mails = watch("mails");

    const handleChangeTab = (
        _: React.SyntheticEvent,
        newValue: string
    ) => {
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

            if (id_maniobra) {
                setFormDisabled(true);
                setLoading(true);

                try {
                    const response = await odooApi.get(`/maniobras/${id_maniobra}`);
                    const maniobra = response.data;
                    reset(maniobra);

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
            } else {
                reset({
                    id_terminal: null,
                    tipo_maniobra: null,
                    operador_id: null,
                    vehicle_id: null,
                    trailer1_id: null,
                    trailer2_id: null,
                    dolly_id: null,
                    inicio_programado: getLocalISOString(),
                    comentarios: "",
                });
            }

            setFormDisabled(false);
            setCorreosLigados([]);
            setCorreosDesligados([]);
            setCpsLigadas([dataCP]);
            setCpsDesligadas([]);
        };

        loadData();
    }, [id_maniobra, show, reset]);

    const comprobacion_correos = () => {
        if (correos_ligados.length === 0) {
            toast.error('Selecciona al menos un correo');
            return false;
        }
        return true;
    };

    const comprobacion_trailer_dolly = () => {
        const trailer2_id = watch("trailer2_id");
        const dolly_id = watch("dolly_id");

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
        return comprobacion_correos() && comprobacion_trailer_dolly();
    };

    const validar_form = handleSubmit((data) => {
        if (validarFormulario()) {
            registrar_maniobra(data);
        }
    });

    const validar_form_actualizar = handleSubmit((data) => {
        if (validarFormulario()) {
            actualizar_maniobra(data);
        }
    });

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const registrar_maniobra = async (dataM: ManiobraForm) => {
        setLoading(true);

        try {
            const dataSend = {
                data: dataM,
                correos_ligados: correos_ligados,
                cps_ligadas: cps_ligadas
            };

            const data = await registrarManiobra(dataSend);

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
        } catch (error: any) {
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

    const actualizar_maniobra = async (dataM: ManiobraForm) => {
        setLoading(true);

        try {
            const dataSend = {
                data: dataM,
                correos_ligados: correos_ligados,
                correos_desligados: correos_desligados,
                cps_ligadas: cps_ligadas,
                cps_desligadas: cps_desligadas
            };
            if (!id_maniobra) return;
            const data = await actualizarManiobra(id_maniobra, dataSend);
            if (data.status === "success") {
                toast.success(data.message);
                handleClose();
                setFormDisabled(true);
            } else {
                toast.error("Error en la actualización: Respuesta inesperada del servidor");
            }
        } catch (error: any) {
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

    const reactivar_maniobra = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas reactivar esta maniobra?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, reactivar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) return;

        try {
            if (!id_maniobra) return;
            const data = await reactivarManiobra(id_maniobra);

            if (data.status === 'success') {
                toast.success(data.message);
                handleClose();
            } else {
                toast.error('Respuesta inesperada: ' + data.message);
            }

        } catch (error) {
            toast.error('Error en la solicitud');
        }
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
                postData.append('id_maniobra', String(id_maniobra));
                postData.append('id_estatus', String(255));
                postData.append('id_usuario', String(session?.user.id));

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
                    .catch(() => {
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
        postData.append('id_maniobra', String(id_maniobra));
        postData.append('id_estatus', String(256));
        postData.append('id_usuario', String(session?.user.id));

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
                    .catch(() => {
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
            <PanelEstatus id_maniobra={id_maniobra} open={openPanelEstatus} handleClose={handleClosePE} />

            <CorreosLigadosManiobra open={openCL} handleClose={handleCloseCL} id_cliente={dataCP?.id_cliente}></CorreosLigadosManiobra>

            <CancelarManiobraDialog
                open={dialogOpen}
                handleClose={handleCloseDialog}
                id_maniobra={id_maniobra}
            />
            <Dialog
                open={show}
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
                                Maniobra M-{id_maniobra} / {dataCP?.id} / {estado}
                            </Typography>
                            <Button autoFocus color="primary" onPress={handleClose} radius='full'>
                                Cerrar
                            </Button>
                        </Toolbar>
                    </AppBar>

                    {loading && (
                        <Box sx={{ width: '100%' }}>
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
                                                <Button color="primary" onPress={() => validar_form()} isLoading={loading} radius='full' size="sm">Registrar</Button>
                                            }
                                            {estado === "borrador" && (
                                                <Button onPress={handleOpenDialog} color="danger" startContent={<i className="bi bi-x-circle"></i>} radius='full' isLoading={loading} size="sm">Cancelar</Button>
                                            )}
                                            {!formDisabled && id_maniobra && (
                                                <Button color="success" onPress={() => validar_form_actualizar()} isLoading={loading} className='text-white' startContent={<i className="bi bi-floppy"></i>} radius='full' size="sm">Guardar</Button>
                                            )}
                                            {estado === "borrador" && formDisabled && (
                                                <Button color="primary" onPress={toggleForm} startContent={<i className="bi bi-pen"></i>} radius='full' isLoading={loading} size="sm">Editar</Button>
                                            )}
                                            {estado === "borrador" && (
                                                <Button color="success" onPress={comprobar_equipo} className='text-white' startContent={<i className="bi bi-play-fill"></i>} radius='full' isLoading={loading} size="sm">Iniciar</Button>
                                            )}
                                            {estado === "activa" && (
                                                <Button onPress={finalizar_maniobra} color="danger" startContent={<i className="bi bi-stop-fill"></i>} radius="full" isLoading={loading} size="sm">Finalizar</Button>
                                            )}
                                            {estado === "activa" && (
                                                <Button onPress={handleClickOpenPE} color="success" className='text-white' startContent={<i className="bi bi-send-fill"></i>} radius="full" isLoading={loading} size="sm">Enviar nuevo estatus</Button>
                                            )}
                                            {estado === "finalizada" && (
                                                <Button color="primary" onPress={reactivar_maniobra} radius='full' isLoading={loading} size="sm">Reactivar</Button>
                                            )}
                                            <Button color="primary" onPress={handleClickOpenCL} startContent={<i className="bi bi-envelope-at-fill"></i>} radius='full' isLoading={loading} size="sm">Correos electronicos</Button>
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
                                                    isLoading={loading}
                                                    size="sm"
                                                >
                                                    Formato de entrega
                                                </Button>)}
                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
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
                                                        <Controller
                                                            control={control}
                                                            name="id_terminal"
                                                            rules={{ required: "Terminal es requerido" }}
                                                            render={({ field, fieldState }) => (
                                                                <>
                                                                    <Autocomplete
                                                                        label="Terminal"
                                                                        isRequired
                                                                        variant={formDisabled ? 'flat' : 'bordered'}
                                                                        isLoading={isLoadingTerminales}
                                                                        isReadOnly={formDisabled}
                                                                        defaultItems={terminales}
                                                                        selectedKey={field.value ? String(field.value) : undefined}
                                                                        onSelectionChange={(val) =>
                                                                            field.onChange(val ? Number(val) : null)
                                                                        }
                                                                        isInvalid={!!fieldState.error}
                                                                        errorMessage={fieldState.error?.message}
                                                                    >
                                                                        {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                                                                    </Autocomplete>
                                                                </>
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <Controller
                                                            control={control}
                                                            name="tipo_maniobra"
                                                            rules={{ required: "El tipo de maniobra es requerido" }}
                                                            render={({ field, fieldState }) => (
                                                                <Autocomplete
                                                                    isRequired
                                                                    label="Tipo de maniobra"
                                                                    variant={formDisabled ? 'flat' : 'bordered'}
                                                                    onSelectionChange={(val) => field.onChange(val)}
                                                                    defaultItems={options_tipo_maniobra}
                                                                    selectedKey={field.value ?? undefined}
                                                                    isReadOnly={formDisabled}
                                                                    isInvalid={!!fieldState.error}
                                                                    errorMessage={fieldState.error?.message}
                                                                >
                                                                    {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                                                                </Autocomplete>
                                                            )}
                                                        />
                                                    </Grid>

                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <Controller
                                                            control={control}
                                                            name="inicio_programado"
                                                            rules={{ required: "Fecha requerida" }}
                                                            render={({ field, fieldState }) => (
                                                                <DatePicker
                                                                    label="Inicio programado"
                                                                    variant={formDisabled ? 'flat' : 'bordered'}
                                                                    value={field.value ? parseDateTime(field.value) : null}
                                                                    isInvalid={!!fieldState.error}
                                                                    errorMessage={fieldState.error?.message}
                                                                    onChange={(val) => {
                                                                        const date = val?.toDate(getLocalTimeZone());
                                                                        const formatted = date?.toISOString().slice(0, 19);
                                                                        field.onChange(formatted);
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>

                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                        <Controller
                                                            control={control}
                                                            name="operador_id"
                                                            render={({ field }) => (
                                                                <SelectOperador
                                                                    label={'Operador'}
                                                                    id={'operador_id'}
                                                                    name={'operador_id'}
                                                                    onChange={(val: number | null) => field.onChange(val)}
                                                                    value={field.value ?? undefined}
                                                                    disabled={formDisabled}
                                                                    options={drivers}
                                                                    isLoading={isLoadingDrivers} error_operador={undefined} />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                        <Controller
                                                            control={control}
                                                            name="vehicle_id"
                                                            render={({ field }) => (
                                                                <SelectFlota
                                                                    label={'Vehiculo'}
                                                                    id={'vehicle_id'}
                                                                    name={'vehicle_id'}
                                                                    onChange={(val: number | null) => field.onChange(val)}
                                                                    value={field.value ?? undefined}
                                                                    disabled={formDisabled}
                                                                    isLoading={isLoadingFlota}
                                                                    options={tractores}
                                                                />)}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <Controller
                                                            control={control}
                                                            name="trailer1_id"
                                                            render={({ field }) => (
                                                                <SelectFlota
                                                                    label={'Remolque 1'}
                                                                    id={'trailer1_id'}
                                                                    name={'trailer1_id'}
                                                                    onChange={(val: number | null) => field.onChange(val)}
                                                                    value={field.value ?? undefined}
                                                                    disabled={formDisabled}
                                                                    isLoading={isLoadingFlota}
                                                                    options={trailers}
                                                                />)}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <Controller
                                                            control={control}
                                                            name="trailer2_id"
                                                            render={({ field }) => (
                                                                <SelectFlota
                                                                    label={'Remolque 2'}
                                                                    id={'trailer2_id'}
                                                                    name={'trailer2_id'}
                                                                    onChange={(val: number | null) => field.onChange(val)}
                                                                    value={field.value ?? undefined}
                                                                    disabled={formDisabled}
                                                                    isLoading={isLoadingFlota}
                                                                    options={trailers}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <Controller
                                                            control={control}
                                                            name="dolly_id"
                                                            render={({ field }) => (
                                                                <SelectFlota
                                                                    label={'Dolly'}
                                                                    id={'dolly_id'}
                                                                    name={'dolly_id'}
                                                                    onChange={(val: number | null) => field.onChange(val)}
                                                                    value={field.value ?? undefined}
                                                                    disabled={formDisabled}
                                                                    isLoading={isLoadingFlota}
                                                                    options={dollies}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                        <Controller
                                                            control={control}
                                                            name="motogenerador_1"
                                                            render={({ field }) => (
                                                                <SelectFlota
                                                                    label={'Motogenerador 1'}
                                                                    id={'motogenerador_1'}
                                                                    name={'motogenerador_1'}
                                                                    onChange={(val: number | null) => field.onChange(val)}
                                                                    value={field.value ?? undefined}
                                                                    disabled={formDisabled}
                                                                    isLoading={isLoadingFlota}
                                                                    options={motogeneradores}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                        <Controller
                                                            control={control}
                                                            name="motogenerador_2"
                                                            render={({ field }) => (
                                                                <SelectFlota
                                                                    label={'Motogenerador 2'}
                                                                    id={'motogenerador_2'}
                                                                    name={'motogenerador_2'}
                                                                    onChange={(val: number | null) => field.onChange(val)}
                                                                    value={field.value ?? undefined}
                                                                    disabled={formDisabled}
                                                                    isLoading={isLoadingFlota}
                                                                    options={motogeneradores}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>

                                                    <Grid size={{ xs: 12, md: 12 }}>
                                                        <Controller
                                                            control={control}
                                                            name="comentarios"
                                                            render={({ field }) => (
                                                                <Textarea
                                                                    isReadOnly={formDisabled}
                                                                    label="Comentarios"
                                                                    labelPlacement="outside"
                                                                    placeholder="Ingresar un comentario (opcional)"
                                                                    variant={formDisabled ? 'flat' : 'bordered'}
                                                                    value={field.value || ""}
                                                                    onValueChange={(val: string) => field.onChange(val)}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardBody>
                                        </Card>

                                        {id_maniobra && (
                                            <div className='mt-4'>
                                                <ManiobraContenedores
                                                    id_maniobra={id_maniobra} />
                                            </div>
                                        )}
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Card>
                                            <CardHeader style={{
                                                background: 'linear-gradient(90deg, #0b2149, #002887)',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}>
                                                Estatus
                                            </CardHeader>
                                            <CardBody>
                                                {estado !== "borrador" && (
                                                    <>
                                                        <div className="flex gap-4 items-center">
                                                            {estado === 'cancelada' && (
                                                                <User
                                                                    name={"Cancelada por: " + watch("usuario_cancelacion")}
                                                                    description={watch("fecha_cancelacion") + ' Motivo: ' + watch("motivo_cancelacion")}
                                                                    avatarProps={{
                                                                        color: "danger"
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        <EstatusHistorialManiobras id_maniobra={id_maniobra}></EstatusHistorialManiobras>
                                                    </>
                                                )}
                                            </CardBody>
                                        </Card>

                                    </Grid>

                                    <Grid size={{ xs: 12, md: 3 }}>
                                        {id_maniobra && (
                                            <Card>
                                                <CardHeader
                                                    style={{
                                                        background: 'linear-gradient(90deg, #002d65, #002d65)',
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }}>Historial de cambios</CardHeader>
                                                <Divider></Divider>
                                                <CardBody>
                                                    <HistorialCambios cambios={mails || []} />
                                                </CardBody>
                                            </Card>
                                        )}
                                    </Grid>
                                </Grid>

                            </TabPanel>
                            <TabPanel value="2">
                                <Card>
                                    <CardBody>
                                        <DocumentacionManiobra id_maniobra={id_maniobra} />
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