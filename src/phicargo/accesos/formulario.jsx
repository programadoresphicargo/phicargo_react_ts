import React, { useState, useEffect, useContext } from 'react';
import { Button, Select, SelectItem } from "@nextui-org/react";
import axios from 'axios';
import Grid from '@mui/material/Grid';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Stack from '@mui/material/Stack';
import Validador from './validacion';
import ModuloVehiculo from './vehiculos/modulo_vehiculo';
import { AccesoContext } from './context';
import ListadoEmpresas from './empresas/tabla';
import SelectedVisitantesTable from './visitantes/visitantes_seleccionados_tabla';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Textarea } from "@nextui-org/react";
import odooApi from '../modules/core/api/odoo-api';
import { Input } from "@nextui-org/react";
import { Progress } from "@nextui-org/react";
import { Box } from '@mui/material';
import {
    Autocomplete,
    AutocompleteSection,
    AutocompleteItem
} from "@nextui-org/react";
import { ClockIcon } from '@mui/x-date-pickers';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AccesoForm = ({ id_acceso, onClose }) => {

    const [openEmpresas, setEmpresas] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingVisitantes, setIsLoadingVisitantes] = useState(false);

    const abrirEmpresas = () => {
        setEmpresas(true);
    };

    const cerrarEmpresas = () => {
        setEmpresas(false);
    };

    const { ActualizarIDAacceso, selectVehiculos, vehiculosAñadidos, vehiculosEliminados, empresas, formData, setFormData, addedVisitors, selectedVisitantes, setSelectedVisitantes, removedVisitors, disabledFom, setFormOptions } = useContext(AccesoContext);

    const EditarForm = () => {
        setFormOptions(false);
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.tipo_movimiento) {
            newErrors.tipo_movimiento = 'Tipo de movimiento es obligatorio';
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
        if (!formData.id_empresa_visitada) {
            newErrors.id_empresa_visitada = 'Empresa visitada es obligatorio';
        }
        if (!formData.tipo_identificacion) {
            newErrors.tipo_identificacion = 'Tipo de identificación es obligatorio';
        }

        if (!formData.areas) {
            newErrors.areas = 'Areas es obligatorio';
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
        { value: 'coppel', label: 'Coppel' }
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
                setFormData({
                    ...formData,
                    id_acceso: data.id_acceso || 0,
                    estado_acceso: data.estado_acceso || '',
                    id_empresa: data.id_empresa || '',
                    empresa: data.empresa || '',
                    id_empresa_visitada: data.id_empresa_visitada || '',
                    tipo_movimiento: data.tipo_movimiento || '',
                    fecha_entrada: data.fecha_entrada || '',
                    fecha_salida: data.fecha_salida || '',
                    tipo_identificacion: data.tipo_identificacion || '',
                    motivo: data.motivo || '',
                    notas: data.notas || '',
                    usuario_creacion: data.usuario_creacion,
                    usuario_valido: data.usuario_valido,
                    usuario_archivo: data.usuario_archivo,
                    fecha_creacion: data.fecha_creacion || '',
                    fecha_validacion: data.fecha_validacion || '',
                    fecha_archivado: data.fecha_archivado || '',
                    areas: data.areas || '',
                });
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

    useEffect(() => {
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

    const handleChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        console.log("Visitantes añadidos:", addedVisitors);
        console.log("Visitantes eliminados:", removedVisitors);
    }, [addedVisitors, removedVisitors]);

    const registrar_acceso = async (e) => {
        console.log(formData);
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
                    toast.success(`Acceso registrado correctamente.`);
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
            setErrors(validationErrors);
        }
    };

    const actualizar_acceso = async (e) => {
        console.log(formData);
        const dataToSend = {
            data: formData,
            visitantes_agregados: addedVisitors,
            visitantes_removidos: removedVisitors,
            vehiculos_agregados: vehiculosAñadidos,
            vehiculos_removidos: vehiculosEliminados
        };

        try {
            setIsLoading(true);
            const response = await odooApi.post('/accesos/actualizar_acceso/' + id_acceso, dataToSend);
            console.log('Respuesta del servidor:', response.data);
            if (response.data.status === "success") {
                toast.success(`Acceso A-${response.data.id_insertado} actualizado correctamente.`);
                onClose();
            } else {
                toast.error("Error al actualizar los datos.");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error en la petición', error);
            toast.error('Error en la conexión o al procesar los datos. ' + error);
        }
    };

    const [OpenValidador, setOpenValidador] = React.useState(false);

    const handleClickOpenValidador = () => {
        setOpenValidador(true);
    };

    const handleCloseValidador = () => {
        setOpenValidador(false);
        onClose();
    };

    const handleSelectionChange = (e) => {
        const val = e.target.value;

        setFormData((prevData) => ({
            ...prevData,
            areas: prevData ? `${prevData},${val}` : val,
        }));
    };

    return (
        <>
            <Stack spacing={2} direction="row" style={{ padding: '20px' }}>
                {id_acceso && (
                    <Typography variant="h4" style={{ marginTop: '20px' }}>
                        Acceso A-{id_acceso}
                    </Typography>
                )}
                {!id_acceso && (
                    <Button onPress={registrar_acceso} style={{ marginTop: '20px' }} color='primary' isLoading={isLoading}>Registrar</Button>
                )}
                {formData.estado_acceso !== 'archivado' && disabledFom && id_acceso && (
                    <Button onPress={EditarForm} style={{ marginTop: '20px' }} color='primary'>Editar</Button>
                )}
                {id_acceso && !disabledFom && (
                    <Button onPress={actualizar_acceso} style={{ marginTop: '20px' }} color='primary' isLoading={isLoading}>Guardar Cambios</Button>
                )}
                {formData.estado_acceso == 'espera' && (
                    <Button onPress={handleClickOpenValidador} style={{ marginTop: '20px' }} color='primary'>Validar {formData.tipo_movimiento}</Button>
                )}
                {formData.estado_acceso == 'validado' && (
                    <Button onPress={handleClickOpenValidador} style={{ marginTop: '20px' }} color='primary'>Archivar / Finalizar acceso</Button>
                )}
            </Stack >

            <Grid container spacing={2} style={{ padding: '20px' }}>
                <Grid item xs={12} sm={4} md={8}>

                    <Card className='mb-3'>
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                                <p className="text-md">Datos del acceso</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        {isLoading ? (
                            <Progress
                                isIndeterminate
                                aria-label="Loading..."
                                size="sm"
                            />
                        ) : ('')}
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

                                <Grid item xs={12} sm={6} md={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!errors.fecha_entrada,
                                                    helperText: errors.fecha_entrada,
                                                }
                                            }}
                                            label="Fecha de entrada"
                                            value={dayjs(formData.fecha_entrada)}
                                            onChange={(newValue) => handleChange('fecha_entrada', newValue ? newValue.toISOString() : '')}
                                            disabled={disabledFom}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!errors.fecha_salida,
                                                    helperText: errors.fecha_salida,
                                                }
                                            }}
                                            label="Fecha de salida"
                                            value={dayjs(formData.fecha_salida)}
                                            onChange={(newValue) => handleChange('fecha_salida', newValue ? newValue.toISOString() : '')}
                                            disabled={disabledFom}
                                        />
                                    </LocalizationProvider>
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

                                <Grid item xs={12} sm={6} md={8}>
                                    <Textarea
                                        id="motivo"
                                        name="motivo"
                                        label="Motivo de entrada o salida"
                                        placeholder="Ingresa una descripción"
                                        variant='bordered'
                                        isDisabled={disabledFom}
                                        value={formData.motivo}
                                        onChange={(event) => handleChange('motivo', event.target.value)}
                                        isInvalid={!!errors.motivo}
                                        errorMessage={errors.motivo}
                                    />
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
                        <CardHeader className="flex gap-3">
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

                                <TimelineItem>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0' }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ m: 'auto 0', fontFamily: 'Inter' }}
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

                                <TimelineItem>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0' }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ m: 'auto 0', fontFamily: 'Inter' }}
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
                            </Timeline>

                        </CardBody>
                        <Divider />
                        <CardFooter>
                        </CardFooter>
                    </Card>
                </Grid>
            </Grid >

            <ListadoEmpresas open={openEmpresas} handleClose={cerrarEmpresas}></ListadoEmpresas>

            <Validador id_acceso={id_acceso} estado_acceso={formData.estado_acceso} open={OpenValidador} handleClose={handleCloseValidador}>
            </Validador>

        </>
    );
};

export default AccesoForm;