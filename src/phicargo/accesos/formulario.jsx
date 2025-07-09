import {
    Autocomplete,
    AutocompleteItem,
    AutocompleteSection,
    form
} from "@heroui/react";
import { Button, Select, SelectItem } from "@heroui/react";
import { Card, CardBody, CardFooter, CardHeader, Divider, Image, Link } from "@heroui/react";
import React, { useContext, useEffect, useState } from 'react';
import { AccesoContext } from './context';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, CardContent } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Checkbox from '@mui/material/Checkbox';
import { ClockIcon } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { Input } from "@heroui/react";
import InputAdornment from '@mui/material/InputAdornment';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import ListadoEmpresas from './empresas/tabla';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ModuloVehiculo from './vehiculos/modulo_vehiculo';
import { Progress } from "@heroui/react";
import SearchIcon from '@mui/icons-material/Search';
import SelectedVisitantesTable from './visitantes/visitantes_seleccionados_tabla';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Textarea } from "@heroui/react";
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Typography from '@mui/material/Typography';
import Validador from './validacion';
import axios from 'axios';
import dayjs from 'dayjs';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";
import { DatePicker } from "@heroui/react";
import { parseDate, parseDateTime, getLocalTimeZone } from "@internationalized/date";
import { Alert } from "@heroui/react";
import { RadioGroup, Radio } from "@heroui/react";
import Swal from 'sweetalert2';
import AppCamara from "./archivos";

const AccesoForm = ({ id_acceso, onClose }) => {

    const [openEmpresas, setEmpresas] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingVisitantes, setIsLoadingVisitantes] = useState(false);
    const [selectedMI, setSelectedMI] = React.useState(null);
    const [selectedME, setSelectedME] = React.useState(null);
    const { session } = useAuthContext();

    const abrirEmpresas = () => {
        setEmpresas(true);
    };

    const cerrarEmpresas = () => {
        setEmpresas(false);
    };

    const { ActualizarIDAacceso, selectVehiculos, vehiculosAñadidos, vehiculosEliminados, empresas, formData, setFormData, addedVisitors, selectedVisitantes, setSelectedVisitantes, removedVisitors, disabledFom, setFormOptions, fileList, setFileList } = useContext(AccesoContext);

    const EditarForm = () => {
        setFormOptions(false);
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.tipo_movimiento) {
            newErrors.tipo_movimiento = 'Tipo de movimiento es obligatorio';
        }
        if (formData.tipo_movimiento == "salida" && formData.id_tipo_salida == null) {
            newErrors.id_tipo_salida = 'Tipo de salida es obligatorio';
        }
        if (!formData.fecha_entrada) {
            newErrors.fecha_entrada = 'Fecha de entrada es obligatoria';
        }
        if (!formData.fecha_salida) {
            newErrors.fecha_salida = 'Fecha de salida es obligatoria';
        }
        if (!formData.id_empresa) {
            newErrors.id_empresa = 'Empresa es obligatoria';
        }
        if (!formData.motivo) {
            newErrors.motivo = 'Motivo es obligatorio';
        }
        if (formData.tipo_movimiento == "entrada" && !formData.id_empresa_visitada) {
            newErrors.id_empresa_visitada = 'Empresa visitada es obligatorio';
        }
        if (formData.tipo_movimiento == "entrada" && !formData.tipo_identificacion) {
            newErrors.tipo_identificacion = 'Tipo de identificación es obligatorio';
        }
        if (formData.tipo_movimiento == "entrada" && !formData.areas) {
            newErrors.areas = 'Areas es obligatorio';
        }
        if (selectedMI == null) {
            newErrors.selectedMI = 'Selecciona una opción.';
        }
        if (selectedME == null) {
            newErrors.selectedME = 'Selecciona una opción.';
        }
        if (selectedMI == 'si' && (formData?.mercancia_ingresada == "" || formData?.mercancia_ingresada == undefined)) {
            newErrors.mercancia_ingresada = 'Ingresar una descripción de la mercancía ingresada.';
        }
        if (selectedME == 'si' && (formData?.mercancia_egresada == "" || formData?.mercancia_egresada == undefined)) {
            newErrors.mercancia_egresada = 'Ingresar una descripción de la mercancía egresada.';
        }
        return newErrors;
    };

    const areas = [
        { value: 'edificio_administrativo', label: 'Edificio Administrativo' },
        { value: 'comedor', label: 'Comedor' },
        { value: 'compras', label: 'Compras' },
        { value: 'nave_mantenimiento', label: 'Nave Mantenimiento' },
        { value: 'servicontainer', label: 'Servicontainer' },
        { value: 'scania', label: 'Scania' },
        { value: 'elektra', label: 'Elektra' },
        { value: 'patio_maniobras', label: 'Patio Maniobras' },
        { value: 'patio_contenedores', label: 'Patio de Contenedores' },
        { value: 'diesel_y_urea', label: 'Diesel y Urea' },
        { value: 'rfe_comprobacion_revision', label: 'RFE (Comprobación y Revisión)' },
        { value: 'estacionamiento_externo', label: 'Estacionamiento Externo' },
        { value: 'perimetro_interior', label: 'Perímetro Interior' },
        { value: 'perimetro_exterior', label: 'Perímetro Exterior' },
        { value: 'coppel', label: 'Coppel' },
        { value: 'fertilizantes_tepeyac', label: 'Fertilizantes Tepeyac' }
    ];

    const identificationOptions = [
        { value: 'ine', label: 'Credencial para Votar (INE/IFE)' },
        { value: 'pasaporte', label: 'Pasaporte Mexicano' },
        { value: 'cartilla', label: 'Cartilla del Servicio Militar Nacional' },
        { value: 'cedula', label: 'Cédula Profesional' },
        { value: 'licencia', label: 'Licencia de Conducir' },
        { value: 'residencia', label: 'Tarjeta de Residencia Temporal o Permanente' },
        { value: 'laboral', label: 'Identificación Laboral' },
        { value: 'residencia_carta', label: 'Carta de Residencia' },
        { value: 'afiliacion', label: 'Tarjeta de Afiliación a Servicios de Salud' },
        { value: 'escolar', label: 'Identificación Escolar' }
    ];

    const options_tipo_movimiento = [
        { value: 'entrada', label: 'Entrada a las instalaciones' },
        { value: 'salida', label: 'Salida de las instalaciones' },
    ];

    const [empresas_visitadas, setEmpresasVisitadasOptions] = useState([]);

    const getAcceso = async () => {
        try {
            setIsLoading(true);
            setFormOptions(true);
            const baseUrl = `/accesos/get_by_id_acceso/${id_acceso}`;
            const response = await odooApi.get(baseUrl);
            const data = response.data[0];
            if (data) {
                getVisitantesAccceso();
                setFormData(data);
                const tieneMercancia = data?.mercancia_ingresada?.trim();
                setSelectedMI(tieneMercancia ? "si" : "no");
                setSelectedME(data?.mercancia_egresada?.trim() ? "si" : "no");
            } else {
                toast.error("No se encontraron datos para el acceso.");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error obteniendo los datos:", error);
            toast.error("Error al obtener datos del acceso.");
        }
    };

    const [tiposSalida, setTiposSalida] = useState([]);


    const getTiposSalida = () => {
        odooApi.get('/accesos/tipos_salida/')
            .then(response => {
                setTiposSalida(response.data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    useEffect(() => {
        getTiposSalida();
        if (id_acceso) {
            fetchEmpresasVisitada();
            getAcceso();
            ActualizarIDAacceso(id_acceso);
        }
    }, [id_acceso]);

    const getVisitantesAccceso = () => {
        setIsLoadingVisitantes(true);
        odooApi.get('/accesos/get_visitantes/' + id_acceso)
            .then(response => {
                const data = response.data;
                setSelectedVisitantes(data);
                setIsLoadingVisitantes(false);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
                setIsLoadingVisitantes(false);
            });
    };

    const fetchEmpresasVisitada = () => {
        odooApi.get('/empresas/get_empresas/')
            .then(response => {
                const data = response.data.map(item => ({
                    value: item.id_empresa,
                    label: item.empresa,
                }));
                setEmpresasVisitadasOptions(data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    useEffect(() => {
        fetchEmpresasVisitada();
    }, []);

    useEffect(() => {
        if (formData.tipo_movimiento !== 'salida') {
            setFormData((prev) => ({
                ...prev,
                id_tipo_salida: null, // o puedes usar undefined o '' según cómo manejes el form
            }));
        }
    }, [formData.tipo_movimiento]);

    const handleChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const registrar_acceso = async (e) => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {

            if (selectedVisitantes.length > 0) {
            } else {
                toast.error("Debes añadir al menos un visitante al acceso.");
                return;
            }

            const dataToSend = {
                data: formData,
                visitantes: selectedVisitantes,
                vehiculos: selectVehiculos,
            };

            try {
                setIsLoading(true);
                const response = await odooApi.post('/accesos/crear_acceso/', dataToSend);
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    onClose();
                } else {
                    toast.error("Error al ingresar acceso: ");
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                toast.error('Error al enviar los datos:' + error);
            }
        } else {
            toast.error('Faltan campos obligatorios.');
            setErrors(validationErrors);
        }
    };

    const actualizar_acceso = async (e) => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {

            if (selectedVisitantes.length > 0) {
            } else {
                toast.error("Debes añadir al menos un visitante al acceso.");
                return;
            }

            const formDataToSend = new FormData();

            const payload = {
                data: formData,
                visitantes_agregados: addedVisitors,
                visitantes_removidos: removedVisitors,
                vehiculos_agregados: vehiculosAñadidos,
                vehiculos_removidos: vehiculosEliminados,
            };

            formDataToSend.append("payload", JSON.stringify(payload));

            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formDataToSend.append("files", file.originFileObj);
                }
            });

            try {
                setIsLoading(true);
                const response = await odooApi.post(`/accesos/actualizar_acceso/${id_acceso}`, formDataToSend, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    onClose();
                } else {
                    toast.error(response.data.message);
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error('Error en la petición', error);
                toast.error('Error en la conexión o al procesar los datos. ' + error);
            }
        } else {
            toast.error('Faltan campos obligatorios2.');
            setErrors(validationErrors);
        }
    };

    const autorizar_acceso = async (e) => {
        Swal.fire({
            title: '¿Qué deseas hacer con esta solicitud?',
            text: "Puedes autorizar o rechazar el acceso.",
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Autorizar',
            denyButtonText: 'Rechazar',
        }).then(async (result) => {
            if (!result.isConfirmed && !result.isDenied) return;

            const nuevo_estado = result.isConfirmed ? 'autorizado' : 'rechazado';

            try {
                setIsLoading(true);
                const response = await odooApi.patch(`/accesos/estado/${id_acceso}/${nuevo_estado}`);

                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    onClose();
                } else {
                    toast.error("Error al actualizar los datos.");
                }
            } catch (error) {
                console.error('Error en la petición', error);
                toast.error('Error en la conexión o al procesar los datos. ' + error);
            } finally {
                setIsLoading(false);
            }
        });
    };

    const [OpenValidador, setOpenValidador] = React.useState(false);

    const handleClickOpenValidador = () => {
        setOpenValidador(true);
    };

    const handleCloseValidador = () => {
        setOpenValidador(false);
    };

    const handleSelectionChange = (e) => {
        const val = e.target.value;

        setFormData((prevData) => ({
            ...prevData,
            areas: prevData ? `${prevData},${val}` : val,
        }));
    };

    const update_fecha = (name, newValue) => {
        const date = newValue.toDate(getLocalTimeZone());
        const formatted = date.getFullYear() +
            '-' + String(date.getMonth() + 1).padStart(2, '0') +
            '-' + String(date.getDate()).padStart(2, '0') +
            'T' + String(date.getHours()).padStart(2, '0') +
            ':' + String(date.getMinutes()).padStart(2, '0') +
            ':' + String(date.getSeconds()).padStart(2, '0');
        setFormData((prevData) => ({
            ...prevData,
            [name]: formatted,
        }));
        console.log(formatted);
    };

    useEffect(() => {
        if (selectedMI === 'no') {
            setFormData(prev => ({
                ...prev,
                mercancia_ingresada: '',
            }));
        }
    }, [selectedMI]);

    useEffect(() => {
        if (selectedME === 'no') {
            setFormData(prev => ({
                ...prev,
                mercancia_egresada: '',
            }));
        }
    }, [selectedME]);

    return (<>
        {isLoading ? (
            <Progress
                isIndeterminate
                aria-label="Loading..."
                size="sm"
            />
        ) : ('')}
        <Stack spacing={2} direction="row" style={{ padding: '20px' }}>
            {id_acceso && (
                <Typography variant="h4" style={{ marginTop: '20px' }}>
                    A-{id_acceso}
                </Typography>
            )}
            {!id_acceso && (
                <Button onPress={registrar_acceso} style={{ marginTop: '20px' }} color='primary' isLoading={isLoading}><i class="bi bi-floppy"></i> Registrar</Button>
            )}
            {formData.estado_acceso !== 'archivado' && disabledFom && id_acceso && (
                <Button onPress={EditarForm} style={{ marginTop: '20px' }} color='primary' isDisabled={isLoading}><i class="bi bi-pen"></i> Editar</Button>
            )}
            {id_acceso && !disabledFom && (
                <Button onPress={actualizar_acceso} style={{ marginTop: '20px' }} isLoading={isLoading} color="success" className="text-white"><i class="bi bi-floppy2-fill"></i> Guardar Cambios</Button>
            )}
            {(formData.estado_acceso === 'espera' || formData.estado_acceso === 'autorizado') && (
                <Button
                    onPress={handleClickOpenValidador}
                    style={{ marginTop: '20px' }}
                    color="primary"
                >
                    Validar {formData.tipo_movimiento}
                </Button>
            )}
            {session?.user?.permissions?.includes(510) && id_acceso && formData.estado_acceso === 'espera' && (
                <Button onPress={autorizar_acceso} style={{ marginTop: '20px' }} color='danger' isDisabled={formData.autorizado_por_id ? true : false}>Autorizar {formData.tipo_movimiento}</Button>
            )}
            {(formData.estado_acceso == 'validado' || formData.estado_acceso == 'rechazado') && (
                < Button onPress={handleClickOpenValidador} style={{ marginTop: '20px' }} color='primary'><i class="bi bi-folder-plus"></i> Archivar / Finalizar acceso</Button>
            )}
        </Stack >
        <Grid container spacing={2} style={{ padding: '20px' }}>
            <Grid item xs={12} sm={4} md={8}>

                {(formData.rechazado_por_id) && (
                    <>
                        <div className="w-full flex items-center mb-3">
                            <Alert
                                color="danger"
                                title={`Registro rechazado, prohibir ${formData.tipo_movimiento}.`}
                                description={`Rechazado por ${formData.usuario_rechazo}.`}
                                variant="solid"
                            />
                        </div>
                    </>
                )}

                {((formData.id_empresa === 1 || [1, 5].includes(formData.id_empresa_visitada))) && (
                    <>
                        <div className="w-full flex items-center mb-3">
                            <Alert
                                color="danger"
                                title="Tu salida debe ser validada previamente."
                                description="Si no se valida, vigilancia no podrá verla y no podrás salir."
                                variant="solid"
                            />
                        </div>
                        <div className="w-full flex items-center mb-3">
                            <Alert
                                color="danger"
                                className="text-white"
                                title="Las entradas vehiculares deben validarse previamente."
                                description="Si no están validadas, vigilancia no podrá ver el acceso y no podrás ingresar."
                                variant="solid"
                            />
                        </div>
                    </>
                )}

                <Card className='mb-3'>
                    <CardHeader style={{
                        background: 'linear-gradient(90deg, #0b2149, #002887)',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        <div className="flex flex-col">
                            <p className="text-md">Datos del acceso</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                    id="tipo_movimiento"
                                    name="tipo_movimiento"
                                    variant='bordered'
                                    label="Tipo de movimiento"
                                    selectedKey={formData.tipo_movimiento || null}
                                    onSelectionChange={(e) => handleChange('tipo_movimiento', e)}
                                    isDisabled={disabledFom}
                                    defaultItems={options_tipo_movimiento}
                                    isInvalid={!!errors.tipo_movimiento}
                                    errorMessage={errors.tipo_movimiento}
                                >
                                    {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                                </Autocomplete>
                            </Grid>

                            {formData.tipo_movimiento == 'salida' && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Autocomplete
                                        id="id_tipo_salida"
                                        name="id_tipo_salida"
                                        variant='bordered'
                                        label="Tipo de salida"
                                        selectedKey={String(formData.id_tipo_salida) || null}
                                        onSelectionChange={(e) => handleChange('id_tipo_salida', e)}
                                        isDisabled={disabledFom}
                                        defaultItems={tiposSalida}
                                        isInvalid={!!errors.id_tipo_salida}
                                        errorMessage={errors.id_tipo_salida}
                                    >
                                        {(item) => <AutocompleteItem key={item.id_tipo_salida}>{item.nombre}</AutocompleteItem>}
                                    </Autocomplete>
                                </Grid>
                            )}

                            <Grid item xs={12} sm={6} md={4}>
                                <DatePicker
                                    firstDayOfWeek="mon"
                                    label="Fecha de entrada"
                                    variant="bordered"
                                    showMonthAndYearPickers
                                    value={parseDateTime(formData.fecha_entrada)}
                                    onChange={(newValue) => update_fecha('fecha_entrada', newValue)}
                                    isDisabled={disabledFom}
                                    errorMessage={errors.fecha_entrada}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <DatePicker
                                    firstDayOfWeek="mon"
                                    label="Fecha de salida"
                                    variant="bordered"
                                    showMonthAndYearPickers
                                    value={parseDateTime(formData.fecha_salida)}
                                    onChange={(newValue) => update_fecha('fecha_salida', newValue)}
                                    isDisabled={disabledFom}
                                    errorMessage={errors.fecha_salida}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Box display="flex" alignItems="center">
                                    <Button color={disabledFom ? "default" : "primary"} size='lg' onPress={abrirEmpresas} isDisabled={disabledFom}><i class="bi bi-search"></i></Button>
                                    <Input
                                        size='sm'
                                        id="id_empresa"
                                        name="id_empresa"
                                        label="Empresa"
                                        variant="bordered"
                                        isDisabled={disabledFom}
                                        defaultValue={(formData.empresa) || ' '}
                                        value={(formData.empresa) || ' '}
                                        isInvalid={!!errors.id_empresa}
                                        errorMessage={errors.id_empresa}
                                        onClick={abrirEmpresas} />
                                </Box>
                            </Grid>

                            <SelectedVisitantesTable></SelectedVisitantesTable>

                            {formData.tipo_movimiento == 'entrada' && (
                                <>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Autocomplete
                                            label="Documento con el que se identifica"
                                            id="tipo_identificacion"
                                            name="tipo_identificacion"
                                            variant='bordered'
                                            selectedKey={formData.tipo_identificacion || null}
                                            onSelectionChange={(e) => handleChange('tipo_identificacion', e)}
                                            isDisabled={disabledFom}
                                            defaultItems={identificationOptions}
                                            isInvalid={!!errors.tipo_identificacion}
                                            errorMessage={errors.tipo_identificacion}
                                        >
                                            {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                                        </Autocomplete>
                                    </Grid>


                                    <Grid item xs={12} sm={6} md={4}>
                                        <Autocomplete
                                            id="id_empresa_visitada"
                                            name="id_empresa_visitada"
                                            label="Empresa visitada"
                                            variant='bordered'
                                            selectedKey={String(formData.id_empresa_visitada) || null}
                                            onSelectionChange={(e) => handleChange('id_empresa_visitada', e)}
                                            defaultItems={empresas_visitadas}
                                            isDisabled={disabledFom}
                                            isInvalid={!!errors.id_empresa_visitada}
                                            errorMessage={errors.id_empresa_visitada}
                                        >
                                            {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                                        </Autocomplete>
                                    </Grid>


                                    <Grid item xs={12} sm={6} md={4}>
                                        <Select
                                            selectionMode="multiple"
                                            isMultiline={true}
                                            id="areas"
                                            name="areas"
                                            variant='bordered'
                                            label="Áreas a visitar"
                                            placeholder="Seleccionar áreas permitidas a transitar"
                                            defaultItems={areas}
                                            isDisabled={disabledFom}
                                            onChange={handleSelectionChange}
                                            selectedKeys={
                                                formData.areas
                                                    ? formData.areas.split(',').map((key) => key.replace(/"/g, '').trim())
                                                    : []
                                            }
                                            isInvalid={!!errors.areas}
                                            errorMessage={errors.areas}
                                        >
                                            {areas.map((animal) => (
                                                <SelectItem key={animal.value}>{animal.label}</SelectItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12} sm={6} md={8}>
                                <Textarea
                                    id="motivo"
                                    name="motivo"
                                    label={`Motivo de ${formData?.tipo_movimiento}`}
                                    placeholder="Ingresa una descripción"
                                    variant='bordered'
                                    isDisabled={disabledFom}
                                    value={formData.motivo}
                                    onChange={(event) => handleChange('motivo', event.target.value)}
                                    isInvalid={!!errors.motivo}
                                    errorMessage={errors.motivo}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <RadioGroup
                                    label="¿Ingresa con equipo/mercancía/material?"
                                    orientation="horizontal"
                                    className="mb-3"
                                    value={selectedMI}
                                    onValueChange={setSelectedMI}
                                    isDisabled={disabledFom}
                                    isInvalid={!!errors.selectedMI}
                                    errorMessage={errors.selectedMI}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </RadioGroup>
                                {selectedMI == 'si' && (
                                    <Textarea
                                        label="Descripción"
                                        placeholder="Ingresar descripción"
                                        variant="bordered"
                                        value={formData?.mercancia_ingresada}
                                        onChange={(event) => handleChange('mercancia_ingresada', event.target.value)}
                                        isDisabled={disabledFom}
                                        isInvalid={!!errors.mercancia_ingresada}
                                        errorMessage={errors.mercancia_ingresada}
                                    />
                                )}
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <RadioGroup
                                    label="¿Sale con equipo/mercancía/material?"
                                    orientation="horizontal"
                                    className="mb-3"
                                    value={selectedME}
                                    onValueChange={setSelectedME}
                                    isDisabled={disabledFom}
                                    isInvalid={!!errors.selectedME}
                                    errorMessage={errors.selectedME}
                                >
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </RadioGroup>
                                {selectedME == 'si' && (
                                    <Textarea
                                        label="Descripción"
                                        placeholder="Ingresar descripción"
                                        variant="bordered"
                                        value={formData?.mercancia_egresada}
                                        onChange={(event) => handleChange('mercancia_egresada', event.target.value)}
                                        isDisabled={disabledFom}
                                        isInvalid={!!errors.mercancia_egresada}
                                        errorMessage={errors.mercancia_egresada}
                                    />
                                )}
                            </Grid>

                        </Grid>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                    </CardFooter>
                </Card>

                <ModuloVehiculo disabled={disabledFom}></ModuloVehiculo>

            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardHeader style={{
                        background: 'linear-gradient(90deg, #0b2149, #002887)',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        <div className="flex flex-col">
                            <p className="text-md">Historial de cambios</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>

                        <Textarea
                            label="Notas para vigilancia"
                            value={formData.notas}
                            variant='bordered'
                            isDisabled={disabledFom}
                            onChange={(event) => handleChange('notas', event.target.value)}
                            placeholder="Ingresa tus notas para el personal de vigilancia" />

                        <Timeline>
                            {formData.usuario_creacion && (
                                <TimelineItem>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0', fontFamily: 'Inter' }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formData.fecha_creacion}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot color="primary">
                                            <ClockIcon />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                        <Typography variant="h6" component="span" sx={{ m: 'auto 0', fontFamily: 'Inter' }}
                                        >
                                            Creado por
                                        </Typography>
                                        <Typography sx={{ m: 'auto 0', fontFamily: 'Inter' }}> {formData.usuario_creacion}</Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            )}
                            {formData.usuario_autorizo && (
                                <TimelineItem>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0', fontFamily: 'Inter' }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formData.fecha_autorizacion}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot color="primary">
                                            <ClockIcon />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                        <Typography variant="h6" component="span" sx={{ m: 'auto 0', fontFamily: 'Inter' }}>
                                            Autorizado por
                                        </Typography>
                                        <Typography sx={{ m: 'auto 0', fontFamily: 'Inter' }}>{formData.usuario_autorizo}</Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            )}

                            {formData.usuario_valido && (
                                <TimelineItem>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0', fontFamily: 'Inter' }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formData.fecha_validacion}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot color="primary">
                                            <ClockIcon />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                        <Typography variant="h6" component="span" sx={{ m: 'auto 0', fontFamily: 'Inter' }}>
                                            Validado por
                                        </Typography>
                                        <Typography sx={{ m: 'auto 0', fontFamily: 'Inter' }}>
                                            {formData.usuario_valido}
                                        </Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            )}

                            {formData.usuario_archivo && (
                                <TimelineItem>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0', fontFamily: 'Inter' }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formData.fecha_archivado}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot color="primary">
                                            <ClockIcon />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                        <Typography variant="h6" component="span" sx={{ m: 'auto 0', fontFamily: 'Inter' }}>
                                            Archivado por
                                        </Typography>
                                        <Typography sx={{ m: 'auto 0', fontFamily: 'Inter' }}>{formData.usuario_archivo}</Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            )}

                            {formData.usuario_rechazo && (
                                <TimelineItem>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0', fontFamily: 'Inter' }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formData.fecha_rechazado}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot color="secondary">
                                            <ClockIcon />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                        <Typography variant="h6" component="span" sx={{ m: 'auto 0', fontFamily: 'Inter' }}>
                                            Rechazado por
                                        </Typography>
                                        <Typography sx={{ m: 'auto 0', fontFamily: 'Inter' }}>{formData.usuario_rechazo}</Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            )}

                        </Timeline>

                    </CardBody>
                    <Divider />
                    <CardFooter>
                    </CardFooter>
                </Card>
                {id_acceso && (
                    <Card className="mt-2">
                        <CardHeader style={{
                            background: 'linear-gradient(90deg, #0b2149, #002887)',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            Añadir evidencias
                        </CardHeader>
                        <Divider></Divider>
                        <CardContent>
                            <AppCamara></AppCamara>
                        </CardContent>
                    </Card>
                )}
            </Grid>
        </Grid >
        <ListadoEmpresas open={openEmpresas} handleClose={cerrarEmpresas}></ListadoEmpresas>
        <Validador id_acceso={id_acceso} estado_acceso={formData.estado_acceso} open={OpenValidador} handleClose={handleCloseValidador}>
        </Validador>
    </>);
};

export default AccesoForm;