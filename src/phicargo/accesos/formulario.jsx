import React, { useState, useEffect, useContext } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import { toast } from 'react-toastify';
import VehiculoForm from './vehiculos/vehiculoForm';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ModuloVehiculo from './vehiculos/modulo_vehiculo';
import { AccesoContext } from './context';
import AccesoCompo from './AccesoCompo';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AccesoForm = ({ id_acceso, onClose }) => {

    const { ActualizarIDAacceso, selectVehiculos, vehiculosAñadidos, vehiculosEliminados } = useContext(AccesoContext);

    const [disabledFom, setFormOptions] = useState(false);
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
        return newErrors;
    };

    const [formData, setFormData] = useState({
        id_acceso: id_acceso,
        estado_acceso: '',
        id_empresa: '',
        id_empresa_visitada: '',
        fecha_entrada: '',
        fecha_salida: '',
        motivo: '',
        notas: '',
        tipo_identificacion: '',
        tipo_movimiento: '',
        areas: '',
        usuario_creacion: '',
        usuario_valido: '',
        usuario_archivo: '',
        fecha_creacion: '',
        fecha_validacion: '',
        fecha_archivado: ''
    });

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

    const [empresas, setOptions] = useState([]);
    const [empresas_visitadas, setEmpresasVisitadasOptions] = useState([]);

    const [inputValue, setInputValue] = useState('');
    const [inputValueNuevoVisitante, setInputValueNuevoVisitante] = useState('');

    const AñadirEmpresa = async (nombreEmpresa) => {
        try {
            const response = await axios.get('/phicargo/accesos/empresas/registrar_empresa.php', {
                params: { nombre_empresa: nombreEmpresa },
            });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchEmpresas();
                handleChange('id_empresa', String(response.data.id_empresa));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error en la solicitud: " + error.message);
        }
    };

    const handleAddNewVisitante = async (newValue) => {
        const dataToSend = {
            id_empresa: formData.id_empresa,
            nombre_visitante: newValue,
        };

        try {
            const response = await axios.post('/phicargo/accesos/visitantes/ingresar.php', dataToSend);

            if (response.data.success) {
                toast.success(response.data.message);

                const nuevoVisitante = { label: String(newValue), value: String(response.data.id_visitante) };
                setVisitantes((prevOptions) => [...prevOptions, nuevoVisitante]);
                setSelectedVisitantes((prevOptions) => [...prevOptions, nuevoVisitante]);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error("Error al agregar el visitante: " + error.message);
        }
    };


    const getAcceso = async () => {
        try {
            setFormOptions(true);
            const baseUrl = `/phicargo/accesos/accesos/getAcceso.php?id_acceso=${id_acceso}`;
            const response = await axios.get(baseUrl);
            const data = response.data[0];
            if (data) {

                getVisitantesAccceso();
                setFormData({
                    ...formData,
                    estado_acceso: data.estado_acceso || '',
                    id_empresa: data.id_empresa || '',
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
        } catch (error) {
            console.error("Error obteniendo los datos:", error);
            toast.error("Error al obtener datos del acceso.");
        }
    };

    useEffect(() => {
        if (formData.id_empresa) {
            fetchVisitantes();
        }
    }, [formData.id_empresa]);

    useEffect(() => {
        if (id_acceso) {
            fetchEmpresas();
            fetchEmpresasVisitada();
            getAcceso();
            ActualizarIDAacceso(id_acceso);
        }
    }, [id_acceso]);

    const getVisitantesAccceso = () => {
        const baseUrl = '/phicargo/accesos/accesos/getVisitantes.php?id_acceso=' + id_acceso;

        axios.get(baseUrl)
            .then(response => {
                const data = response.data.map(item => ({
                    value: item.id_visitante,
                    label: item.nombre_visitante,
                }));
                setSelectedVisitantes(data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    const fetchEmpresas = () => {
        const baseUrl = '/phicargo/accesos/empresas/getEmpresas.php';

        axios.get(baseUrl)
            .then(response => {
                const data = response.data.map(item => ({
                    value: item.id_empresa,
                    label: item.nombre_empresa,
                }));
                setOptions(data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    const fetchEmpresasVisitada = () => {
        const baseUrl = '/phicargo/accesos/empresas/getEmpresasVisitadas.php';

        axios.get(baseUrl)
            .then(response => {
                const data = response.data.map(item => ({
                    value: item.id_empresa,
                    label: item.nombre,
                }));
                setEmpresasVisitadasOptions(data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    const [visitantes, setVisitantes] = useState([]);
    const [selectedVisitantes, setSelectedVisitantes] = useState([]);
    const [addedVisitors, setAddedVisitors] = useState([]);
    const [removedVisitors, setRemovedVisitors] = useState([]);

    const fetchVisitantes = () => {
        const baseUrl = '/phicargo/accesos/visitantes/getVisitantes.php?id_empresa=' + formData.id_empresa;

        axios.get(baseUrl)
            .then(response => {
                const data = response.data.map(item => ({
                    value: item.id_visitante,
                    label: item.nombre_visitante,
                }));
                setVisitantes(data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    useEffect(() => {
        fetchEmpresas();
        fetchEmpresasVisitada();
    }, []);

    const handleChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDelete = (valueToDelete) => {
        setSelectedVisitantes((prevVisitantes) => {
            const visitanteAEliminar = prevVisitantes.find(visitor => visitor.value === valueToDelete);

            if (visitanteAEliminar) {
                setRemovedVisitors((prevRemoved) => [...prevRemoved, visitanteAEliminar]);
            }

            return prevVisitantes.filter(visitor => visitor.value !== valueToDelete);
        });
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
                ...formData,
                visitantes_seleccionados: selectedVisitantes,
                vehiculos_seleccionados: selectVehiculos,
            };

            try {
                const response = await axios.post('/phicargo/accesos/acceso/registrar.php', dataToSend);
                console.log('Respuesta del servidor:', response.data);
                if (response.data.status === 1) {
                    toast.success(`Acceso registrado correctamente.`);
                    onClose();
                } else {
                    toast.error("Error al actualizar los datos.");
                }
            } catch (error) {
                console.error('Error al enviar los datos:', error);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const actualizar_acceso = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            visitantesAñadidos: addedVisitors,
            visitantesEliminados: removedVisitors,
            vehiculosAñadidos: vehiculosAñadidos,
            vehiculosEliminados: vehiculosEliminados
        };

        try {
            const response = await axios.post('/phicargo/accesos/acceso/actualizar.php', dataToSend);
            console.log('Respuesta del servidor:', response.data);
            if (response.data.status === 1) {
                toast.success(`Acceso A-${response.data.id_insertado} actualizado correctamente.`);
                onClose();
            } else {
                toast.error("Error al actualizar los datos.");
            }
        } catch (error) {
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

    const handleSelectionChange = (event, newValue) => {
        setFormData((prevData) => ({
            ...prevData,
            areas: JSON.stringify(newValue),
        }));
    };

    const ClickVisitante = (name, value) => {
        if (!value) return;

        const selectedVisitor = visitantes.find(option => option.value === value);

        if (selectedVisitor) {
            setSelectedVisitantes((prevVisitantes) => {
                const isSelected = prevVisitantes.some(v => v.value === selectedVisitor.value);

                if (!isSelected) {
                    setAddedVisitors((prevAdded) => {
                        if (!prevAdded.some(v => v.value === selectedVisitor.value)) {
                            return [...prevAdded, selectedVisitor];
                        }
                        return prevAdded;
                    });
                    return [...prevVisitantes, selectedVisitor];
                }
                return prevVisitantes;
            });
        }
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
                    <Button onClick={registrar_acceso} style={{ marginTop: '20px' }} color='primary'>Registrar</Button>
                )}
                {formData.estado_acceso !== 'archivado' && disabledFom && id_acceso && (
                    <Button onClick={EditarForm} style={{ marginTop: '20px' }} color='primary'>Editar</Button>
                )}
                {id_acceso && !disabledFom && (
                    <Button onClick={actualizar_acceso} style={{ marginTop: '20px' }} color='primary'>Guardar Cambios</Button>
                )}
                {formData.estado_acceso == 'espera' && (
                    <Button onClick={handleClickOpenValidador} style={{ marginTop: '20px' }} color='primary'>Validar {formData.tipo_movimiento}</Button>
                )}
                {formData.estado_acceso == 'validado' && (
                    <Button onClick={handleClickOpenValidador} style={{ marginTop: '20px' }} color='primary'>Archivar / Finalizar acceso</Button>
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
                        <CardBody>

                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Autocomplete
                                        id="tipo_movimiento"
                                        name="tipo_movimiento"
                                        value={options_tipo_movimiento.find(option => option.value === formData.tipo_movimiento) || null}
                                        onChange={(event, newValue) => handleChange('tipo_movimiento', newValue ? newValue.value : '')}
                                        getOptionLabel={(option) => option.label}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        options={options_tipo_movimiento}
                                        disabled={disabledFom}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tipo de movimiento"
                                                variant="outlined"
                                                error={!!errors.tipo_movimiento}
                                                helperText={errors.tipo_movimiento}
                                            />
                                        )}
                                    />
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
                                    <Autocomplete
                                        id="id_empresa"
                                        name="id_empresa"
                                        value={empresas.find(option => option.value === formData.id_empresa) || null}
                                        onChange={(event, newValue) => {
                                            if (typeof newValue === 'string') {
                                                AñadirEmpresa(newValue);
                                            } else if (newValue && newValue.inputValue) {
                                                AñadirEmpresa(newValue.inputValue);
                                            } else {
                                                handleChange('id_empresa', newValue ? newValue.value : '');
                                            }
                                        }}
                                        inputValue={inputValue}
                                        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                                        getOptionLabel={(option) => option.label || ''}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        options={empresas}
                                        filterOptions={(options, params) => {
                                            const filtered = options.filter(option =>
                                                option.label.toLowerCase().includes(params.inputValue.toLowerCase())
                                            );

                                            if (params.inputValue !== '' && !filtered.some(option => option.label === params.inputValue)) {
                                                filtered.push({
                                                    label: `Añadir nueva empresa "${params.inputValue}"`,
                                                    inputValue: params.inputValue
                                                });
                                            }

                                            return filtered;
                                        }}
                                        disabled={disabledFom}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Empresa"
                                                variant="outlined"
                                                error={!!errors.id_empresa}
                                                helperText={errors.id_empresa}
                                            />
                                        )}
                                    />
                                    <Typography variant="body3" color="primary" style={{ marginTop: '8px' }}>
                                        No se permiten números ni caracteres especiales.
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Autocomplete
                                        id="visitantes"
                                        name="visitantes"
                                        disabled={disabledFom}
                                        value={visitantes.find(option => option.value === formData.visitantes) || null}
                                        onChange={(event, newValue) => {
                                            if (typeof newValue === 'string') {
                                                // Si es un string, se está agregando una nueva opción
                                                handleAddNewVisitante(newValue);
                                            } else if (newValue && newValue.inputValue) {
                                                // Si hay un `inputValue`, se está agregando una nueva opción personalizada
                                                handleAddNewVisitante(newValue.inputValue);
                                            } else {
                                                // Si es una opción existente, actualizamos el estado
                                                handleChange('visitantes', newValue ? newValue.value : '');
                                                ClickVisitante('visitantes', newValue ? newValue.value : '');
                                            }
                                        }}
                                        inputValue={inputValueNuevoVisitante}
                                        onInputChange={(event, newInputValue) => {
                                            const regex = /^[a-zA-Z\s]*$/;
                                            if (regex.test(newInputValue) || newInputValue === '') {
                                                setInputValueNuevoVisitante(newInputValue);
                                            }
                                        }}
                                        getOptionLabel={(option) => option.label || ''}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        options={visitantes}
                                        filterOptions={(options, params) => {
                                            const filtered = options.filter(option =>
                                                option.label.toLowerCase().includes(params.inputValue.toLowerCase())
                                            );

                                            if (params.inputValue !== '' && !filtered.some(option => option.label === params.inputValue)) {
                                                filtered.push({
                                                    label: `Añadir nuevo visitante "${params.inputValue}"`,
                                                    inputValue: params.inputValue
                                                });
                                            }

                                            return filtered;
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Visitantes"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                    <Typography variant="body3" color="primary" style={{ marginTop: '8px' }}>
                                        Por favor, ingresa los visitantes uno por uno. No se permiten números ni caracteres especiales.
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Autocomplete
                                        id="tipo_identificacion"
                                        name="tipo_identificacion"
                                        value={identificationOptions.find(option => option.value === formData.tipo_identificacion) || null}
                                        onChange={(event, newValue) => handleChange('tipo_identificacion', newValue ? newValue.value : '')}
                                        getOptionLabel={(option) => option.label}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        options={identificationOptions}
                                        disabled={disabledFom}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Documento con el que se identifica"
                                                variant="outlined"
                                                error={!!errors.tipo_identificacion}
                                                helperText={errors.tipo_identificacion}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12}>
                                    <Table aria-label="Example static collection table" isStriped>
                                        <TableHeader>
                                            <TableColumn>ID del visitante</TableColumn>
                                            <TableColumn>Visitante</TableColumn>
                                            <TableColumn>Acciones</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedVisitantes.map((visitor, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{visitor.value}</TableCell>
                                                    <TableCell>{visitor.label}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            color="primary" size='sm'
                                                            isDisabled={disabledFom}
                                                            onClick={() => handleDelete(visitor.value)}
                                                        >
                                                            Borrar
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Autocomplete
                                        id="id_empresa_visitada"
                                        name="id_empresa_visitada"
                                        value={empresas_visitadas.find(option => option.value === formData.id_empresa_visitada) || null}
                                        onChange={(event, newValue) => handleChange('id_empresa_visitada', newValue ? newValue.value : '')}
                                        getOptionLabel={(option) => option.label}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        options={empresas_visitadas}
                                        disabled={disabledFom}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Empresa visitada"
                                                variant="outlined"
                                                error={!!errors.id_empresa_visitada}
                                                helperText={errors.id_empresa_visitada}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Autocomplete
                                        multiple
                                        id="areas"
                                        name="areas"
                                        options={areas}
                                        disabled={disabledFom}
                                        disableCloseOnSelect
                                        getOptionLabel={(option) => option.label}
                                        onChange={handleSelectionChange} // Llama a la función que maneja el cambio
                                        value={formData.areas ? JSON.parse(formData.areas) : []} // Convierte el string a array
                                        renderOption={(props, option, { selected }) => {
                                            const { key, ...optionProps } = props;
                                            return (
                                                <li key={key} {...optionProps}>
                                                    <Checkbox
                                                        icon={<span />} // Reemplaza con tu ícono
                                                        checkedIcon={<span />} // Reemplaza con tu ícono
                                                        style={{ marginRight: 8 }}
                                                        checked={selected}
                                                    />
                                                    {option.label}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params}
                                                label="Áreas a visitar"
                                                placeholder="Seleccionar áreas permitidas a transitar" />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        id="motivo"
                                        name="motivo"
                                        label="Motivo de entrada o salida"
                                        placeholder="Ingresa una descripción"
                                        disabled={disabledFom}
                                        value={formData.motivo}
                                        onChange={(event) => handleChange('motivo', event.target.value)}
                                        fullWidth
                                        error={!!errors.motivo}
                                        helperText={errors.motivo}
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

                <Grid item xs={4}>
                    <Card>
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                                <p className="text-md">Historial de cambios</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>

                            <TextField
                                label="Notas para vigilancia"
                                placeholder="Ingresa tus notas para el personal de vigilancia"
                                multiline
                                rows={5}
                                disabled={disabledFom}
                                value={formData.notas}
                                onChange={(event) => handleChange('notas', event.target.value)}
                            />

                            <Timeline>
                                <TimelineItem>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0' }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formData.fecha_creacion}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot color="primary">
                                            <LaptopMacIcon />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                        <Typography variant="h6" component="span">
                                            Creado por
                                        </Typography>
                                        <Typography> {formData.usuario_creacion}</Typography>
                                    </TimelineContent>
                                </TimelineItem>

                                <TimelineItem>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0' }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formData.fecha_validacion}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot color="primary">
                                            <LaptopMacIcon />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                        <Typography variant="h6" component="span">
                                            Validado por
                                        </Typography>
                                        <Typography>
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
                                    >
                                        {formData.fecha_archivado}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot color="primary">
                                            <LaptopMacIcon />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                        <Typography variant="h6" component="span">
                                            Archivado por
                                        </Typography>
                                        <Typography>{formData.usuario_archivo}</Typography>
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

            <Validador id_acceso={id_acceso} estado_acceso={formData.estado_acceso} open={OpenValidador} handleClose={handleCloseValidador}>
            </Validador>

        </>
    );
};

export default AccesoForm;