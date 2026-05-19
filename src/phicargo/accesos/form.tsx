import { Button } from "@heroui/react";
import { Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import React, { useEffect, useState } from 'react';
import { useAcceso } from './context';
import { Box, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import ListadoEmpresas from './empresas/tabla';
import ModuloVehiculo from './vehiculos/modulo';
import { Progress } from "@heroui/react";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Validador from './validacion';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";
import { DatePicker } from "@heroui/react";
import { getLocalTimeZone, parseDateTime } from "@internationalized/date";
import { Alert } from "@heroui/react";
import { RadioGroup, Radio } from "@heroui/react";
import Swal from 'sweetalert2';
import AppCamara from "./archivos";
import SelectedEmpleadosTable from "./empleados/empleados_seleccionados";
import SelectedVisitantesTable from "./visitantes/visitantes";
import { AutocompleteInput, NumberInput, TextInput, TextareaInput } from "@/components/inputs";
import { Controller, useForm } from "react-hook-form";
import { Empresa } from "./types";
import HistorialCambios from "../almacen/solicitud/cambios/epps";

type TipoSalida = {
    id_tipo_salida: number;
    nombre: string;
}

type TipoSalidaResponse = {
    key: number;
    value: string;
}

type EmpresaResponse = {
    key: number;
    value: string;
}

export type Acceso = {
    estado_acceso: string;
    fecha_entrada: string;
    fecha_salida: string;
    tipo_persona: "empleado" | "visitante";
    id_empresa: number | null;
    empresa: string;
    tipo_movimiento: string | null;
    id_tipo_salida: number | null;
    tipo_identificacion: string | null;
    motivo: string | null;
    personal_visita: string | null;
    areas: string | null;
    id_empresa_visitada: number | null;

    ingresa_mercancia: string | null;
    mercancia_ingresada: string | null;

    egresa_mercancia: string | null;
    mercancia_egresada: string | null;
    notas: string | null;
    mails?: any[];

    autorizado_por_id?: number | null;
    rechazado_por_id?: number | null;
}

function getLocalISOString() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 19);
}

const AccesoForm = ({ id_acceso, onClose }: { id_acceso: number | null, onClose: () => void }) => {

    const [openEmpresas, setEmpresas] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { session } = useAuthContext();

    const initialForm: Acceso = {
        id_empresa: null,
        fecha_entrada: getLocalISOString(),
        fecha_salida: getLocalISOString(),
        empresa: '',
        estado_acceso: "borrador",
        tipo_persona: "visitante",
        tipo_movimiento: null,
        id_tipo_salida: null,
        tipo_identificacion: null,
        motivo: null,
        personal_visita: session?.user.name || '',
        areas: null,
        id_empresa_visitada: null,

        ingresa_mercancia: null,
        mercancia_ingresada: null,

        egresa_mercancia: null,
        mercancia_egresada: null,
        notas: null
    }

    const { control, handleSubmit, reset, watch, setValue } = useForm<Acceso>({
        defaultValues: initialForm,
    });

    useEffect(() => {
        if (session?.user?.name) {
            reset({
                ...initialForm,
                personal_visita: session.user.name
            });
        }
    }, [session]);

    const id_empresa = watch("id_empresa");
    const tipo_movimiento = watch("tipo_movimiento");
    const estado_acceso = watch("estado_acceso");
    const autorizado_por_id = watch("autorizado_por_id");
    const ingresa_mercancia = watch("ingresa_mercancia");
    const egresa_mercancia = watch("egresa_mercancia");
    const mails = watch("mails");

    const abrirEmpresas = () => {
        setEmpresas(true);
    };

    const cerrarEmpresas = () => {
        setEmpresas(false);
    };

    const {
        setVisitantesOriginales,
        visitantesActuales,
        setVisitantesActuales,
        setVehiculosOriginales,
        setVehiculosActuales,
        setEmpleadosOriginales,
        empleadosActuales,
        setEmpleadosActuales,
        fileList,
        setDisabledForm,
        disabledForm,
        vehiculosActuales
    } = useAcceso()

    const EditarForm = () => {
        setDisabledForm(false);
    };

    const areas = [
        { key: 'edificio_administrativo', value: 'Edificio Administrativo' },
        { key: 'comedor', value: 'Comedor' },
        { key: 'compras', value: 'Compras' },
        { key: 'nave_mantenimiento', value: 'Nave Mantenimiento' },
        { key: 'servicontainer', value: 'Servicontainer' },
        { key: 'scania', value: 'Scania' },
        { key: 'elektra', value: 'Elektra' },
        { key: 'patio_maniobras', value: 'Patio Maniobras' },
        { key: 'patio_contenedores', value: 'Patio de Contenedores' },
        { key: 'diesel_y_urea', value: 'Diesel y Urea' },
        { key: 'estacionamiento_externo', value: 'Estacionamiento Externo' },
        { key: 'perimetro_interior', value: 'Perímetro Interior' },
        { key: 'perimetro_exterior', value: 'Perímetro Exterior' },
        { key: 'm&m_internacional', value: 'M&M internacional' },
        { key: 'fertilizantes_tepeyac', value: 'Fertilizantes Tepeyac' },
        { key: 'patio_resguardo_scania', value: 'Patio de resguardo scania' }
    ];

    const identificationOptions = [
        { key: 'ine', value: 'Credencial para Votar (INE/IFE)' },
        { key: 'pasaporte', value: 'Pasaporte Mexicano' },
        { key: 'cartilla', value: 'Cartilla del Servicio Militar Nacional' },
        { key: 'cedula', value: 'Cédula Profesional' },
        { key: 'licencia', value: 'Licencia de Conducir' },
        { key: 'residencia', value: 'Tarjeta de Residencia Temporal o Permanente' },
        { key: 'laboral', value: 'Identificación Laboral' },
        { key: 'residencia_carta', value: 'Carta de Residencia' },
        { key: 'afiliacion', value: 'Tarjeta de Afiliación a Servicios de Salud' },
        { key: 'escolar', value: 'Identificación Escolar' }
    ];

    const options_tipo_movimiento = [
        { key: 'entrada', value: 'Entrada a las instalaciones' },
        { key: 'salida', value: 'Salida de las instalaciones' },
    ];

    const [empresas_visitadas, setEmpresasVisitadasOptions] = useState<EmpresaResponse[]>([]);

    const getAcceso = async () => {
        try {
            setIsLoading(true);
            setDisabledForm(true);
            const baseUrl = `/accesos/${id_acceso}`;
            const response = await odooApi.get(baseUrl);
            const data = response.data;
            if (data) {
                reset({
                    ...data,
                    ingresa_mercancia:
                        data?.mercancia_ingresada?.trim()
                            ? "si"
                            : "no",

                    egresa_mercancia:
                        data?.mercancia_egresada?.trim()
                            ? "si"
                            : "no"
                });

                setVisitantesOriginales(data?.visitantes);
                setEmpleadosOriginales(data?.empleados);
                setVehiculosOriginales(data?.vehiculos);

                setVisitantesActuales(data?.visitantes);
                setEmpleadosActuales(data?.empleados);
                setVehiculosActuales(data?.vehiculos);

            } else {
                toast.error("No se encontraron datos para el acceso.");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast.error("Error al obtener datos del acceso.");
        }
    };

    const [tiposSalida, setTiposSalida] = useState<TipoSalidaResponse[]>([]);

    const getTiposSalida = () => {
        odooApi.get<TipoSalida[]>('/accesos/tipos_salida/')
            .then(response => {
                const data = response.data.map(item => ({
                    key: item.id_tipo_salida,
                    value: item.nombre,
                }));
                setTiposSalida(data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    useEffect(() => {
        fetchEmpresasVisitada();
        getTiposSalida();

        if (id_acceso) {
            getAcceso();
        }
    }, [id_acceso]);

    const fetchEmpresasVisitada = () => {
        odooApi.get<Empresa[]>('/empresas/get_empresas/')
            .then(response => {
                const data = response.data.map(item => ({
                    key: item.id_empresa,
                    value: item.empresa,
                }));
                setEmpresasVisitadasOptions(data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    useEffect(() => {
        if (tipo_movimiento !== 'salida') {
            setValue("id_tipo_salida", null);
        }
    }, [tipo_movimiento, setValue]);

    useEffect(() => {
        if (!id_empresa) return;
        setValue("tipo_persona", id_empresa === 1 ? "empleado" : "visitante");
    }, [id_empresa, setValue]);

    const registrarAcceso = async (data: Acceso) => {

        const esEmpresa = id_empresa === 1;
        const lista = esEmpresa ? empleadosActuales : visitantesActuales;

        if (lista.length === 0) {
            toast.error(
                `Debes añadir al menos un ${esEmpresa ? "empleado" : "visitante"} al acceso.`
            );
            return;
        }

        const dataToSend = {
            data: data,
            visitantes: visitantesActuales,
            vehiculos: vehiculosActuales,
            empleados: empleadosActuales,
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
        } catch (error: any) {
            const mensaje =
                error.response?.data?.detail || error.message || "Error desconocido";

            toast.error("Error al procesar los datos. " + mensaje);
        } finally {
            setIsLoading(false);
        }
    }

    const actualizar_acceso = async (data: Acceso) => {

        const esEmpresa = id_empresa === 1;
        const lista = esEmpresa ? empleadosActuales : visitantesActuales;

        if (lista.length === 0) {
            toast.error(
                `Debes añadir al menos un ${esEmpresa ? "empleado" : "visitante"} al acceso.`
            );
            return;
        }

        const formDataToSend = new FormData();

        const payload = {
            data: data,
            visitantesActuales: visitantesActuales,
            vehiculosActuales: vehiculosActuales,
            empleadosActuales: empleadosActuales,
        };

        formDataToSend.append("payload", JSON.stringify(payload));

        fileList.forEach((file: any) => {
            if (file.originFileObj) {
                formDataToSend.append("files", file.originFileObj);
            }
        });

        try {
            setIsLoading(true);
            const response = await odooApi.patch(`/accesos/${id_acceso}`, formDataToSend, {
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
    };

    const autorizarAcceso = async () => {
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
                const response = await odooApi.patch(`/accesos/${id_acceso}/estado?estado=${nuevo_estado}`,
                    {
                        estado: nuevo_estado
                    });

                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    onClose();
                } else {
                    toast.error("Error al actualizar los datos.");
                }
            } catch (error: any) {
                const mensaje =
                    error.response?.data?.detail || error.message || "Error desconocido";

                toast.error("Error al procesar los datos. " + mensaje);
            }
            finally {
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
        onClose();
    };

    useEffect(() => {
        if (ingresa_mercancia === "no") {
            setValue("mercancia_ingresada", null);
        }
    }, [ingresa_mercancia]);

    useEffect(() => {
        if (egresa_mercancia === "no") {
            setValue("mercancia_egresada", null);
        }
    }, [egresa_mercancia]);

    return (
        <>
            {isLoading && (
                <Progress
                    isIndeterminate
                    aria-label="Loading..."
                    size="sm"
                />
            )}

            <Stack spacing={2} direction="row" style={{ padding: '20px' }}>
                {id_acceso && (
                    <Typography variant="h4" style={{ marginTop: '20px' }}>
                        A-{id_acceso}
                    </Typography>
                )}
                {!id_acceso && (
                    <Button radius="full" onPress={() => handleSubmit(registrarAcceso)()} style={{ marginTop: '20px' }} color='primary' isLoading={isLoading}><i className="bi bi-floppy"></i> Registrar</Button>
                )}
                {estado_acceso !== 'archivado' && disabledForm && id_acceso && (
                    <Button radius="full" onPress={EditarForm} style={{ marginTop: '20px' }} color='primary' isDisabled={isLoading}><i className="bi bi-pen"></i> Editar</Button>
                )}
                {id_acceso && !disabledForm && (
                    <Button radius="full" onPress={() => handleSubmit(actualizar_acceso)()} style={{ marginTop: '20px' }} isLoading={isLoading} color="success" className="text-white"><i className="bi bi-floppy2-fill"></i> Guardar</Button>
                )}
                {(estado_acceso === 'espera' || estado_acceso === 'autorizado') && (
                    <Button
                        radius="full"
                        onPress={handleClickOpenValidador}
                        style={{ marginTop: '20px' }}
                        color="primary"
                    >
                        Validar {tipo_movimiento}
                    </Button>
                )}
                {session?.user?.permissions?.includes(510) && id_acceso && estado_acceso === 'espera' && (
                    <Button radius="full" onPress={() => autorizarAcceso()} style={{ marginTop: '20px' }} color='danger' isDisabled={autorizado_por_id ? true : false}>Autorizar {tipo_movimiento}</Button>
                )}
                {(estado_acceso === 'validado' || estado_acceso === 'rechazado') && (
                    < Button radius="full" onPress={handleClickOpenValidador} style={{ marginTop: '20px' }} color='primary'><i className="bi bi-folder-plus"></i> Archivar / Finalizar acceso</Button>
                )}
            </Stack >
            <Grid container spacing={2} style={{ padding: '20px' }}>
                <Grid item xs={12} sm={4} md={8}>

                    {((id_empresa === 1 && tipo_movimiento == "salida") || (vehiculosActuales.length > 0)) && (
                        <>
                            <div className="w-full flex gap-4 mb-3">
                                <div className="w-1/2">
                                    <Alert
                                        color="danger"
                                        title="Tu salida debe ser validada previamente."
                                        description="Si no se valida, vigilancia no podrá verla y no podrás salir."
                                        variant="solid"
                                    />
                                </div>

                                <div className="w-1/2">
                                    <Alert
                                        color="danger"
                                        className="text-white"
                                        title="Las entradas vehiculares deben validarse previamente."
                                        description="Si no están validadas, vigilancia no podrá ver el acceso y no podrás ingresar."
                                        variant="solid"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <Card className='mb-3'>
                        <CardHeader
                            style={{
                                background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
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
                                    <AutocompleteInput
                                        control={control}
                                        label="Tipo de movimiento"
                                        name="tipo_movimiento"
                                        readOnly={disabledForm}
                                        items={options_tipo_movimiento}
                                        variant={disabledForm ? 'flat' : 'bordered'}
                                        rules={{ required: 'Campo obligatorio' }}
                                        size="md"
                                    />
                                </Grid>

                                {tipo_movimiento == 'salida' && (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <AutocompleteInput
                                            control={control}
                                            label="Tipo de salida"
                                            name="id_tipo_salida"
                                            readOnly={disabledForm}
                                            items={tiposSalida}
                                            variant={disabledForm ? 'flat' : 'bordered'}
                                            rules={{ required: 'Campo obligatorio' }}
                                            size="md"
                                        />
                                    </Grid>
                                )}

                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        control={control}
                                        name="fecha_entrada"
                                        rules={{ required: "Fecha requerida" }}
                                        render={({ field, fieldState }) => (
                                            <DatePicker
                                                label="Fecha entrada"
                                                variant={disabledForm ? 'flat' : 'bordered'}
                                                value={
                                                    field.value
                                                        ? parseDateTime(field.value.replace(' ', 'T'))
                                                        : null
                                                }
                                                isInvalid={!!fieldState.error}
                                                errorMessage={fieldState.error?.message}
                                                onChange={(val) => {
                                                    const date = val?.toDate(getLocalTimeZone());

                                                    if (!date) {
                                                        field.onChange(null);
                                                        return;
                                                    }

                                                    const formatted =
                                                        `${date.getFullYear()}-` +
                                                        `${String(date.getMonth() + 1).padStart(2, '0')}-` +
                                                        `${String(date.getDate()).padStart(2, '0')} ` +
                                                        `${String(date.getHours()).padStart(2, '0')}:` +
                                                        `${String(date.getMinutes()).padStart(2, '0')}:` +
                                                        `${String(date.getSeconds()).padStart(2, '0')}`;

                                                    field.onChange(formatted);
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        control={control}
                                        name="fecha_salida"
                                        rules={{ required: "Fecha requerida" }}
                                        render={({ field, fieldState }) => (
                                            <DatePicker
                                                label="Fecha salida"
                                                variant={disabledForm ? 'flat' : 'bordered'}
                                                value={
                                                    field.value
                                                        ? parseDateTime(field.value.replace(' ', 'T'))
                                                        : null
                                                }
                                                isInvalid={!!fieldState.error}
                                                errorMessage={fieldState.error?.message}
                                                onChange={(val) => {
                                                    const date = val?.toDate(getLocalTimeZone());

                                                    if (!date) {
                                                        field.onChange(null);
                                                        return;
                                                    }

                                                    const formatted =
                                                        `${date.getFullYear()}-` +
                                                        `${String(date.getMonth() + 1).padStart(2, '0')}-` +
                                                        `${String(date.getDate()).padStart(2, '0')} ` +
                                                        `${String(date.getHours()).padStart(2, '0')}:` +
                                                        `${String(date.getMinutes()).padStart(2, '0')}:` +
                                                        `${String(date.getSeconds()).padStart(2, '0')}`;

                                                    field.onChange(formatted);
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Box display="flex" alignItems="center">
                                        <Button
                                            color={disabledForm ? "default" : "primary"}
                                            size='lg'
                                            onPress={abrirEmpresas}
                                            isDisabled={disabledForm}>
                                            <i className="bi bi-search"></i>
                                        </Button>
                                        <NumberInput
                                            control={control}
                                            label="Empresa"
                                            name="id_empresa"
                                        />
                                        <TextInput
                                            readOnly
                                            control={control}
                                            label="Empresa"
                                            name="empresa"
                                        />
                                    </Box>
                                </Grid>

                                {id_empresa !== 1 ? (
                                    <SelectedVisitantesTable id_empresa={id_empresa}></SelectedVisitantesTable>
                                ) : (
                                    <SelectedEmpleadosTable></SelectedEmpleadosTable>
                                )}
                                {tipo_movimiento === 'entrada' && (
                                    <>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <AutocompleteInput
                                                control={control}
                                                label="Documento con el que se identifica"
                                                name="tipo_identificacion"
                                                items={identificationOptions}
                                                variant={disabledForm ? 'flat' : 'bordered'}
                                                readOnly={disabledForm}
                                                rules={{ required: 'Campo obligatorio' }}
                                                size="md"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <AutocompleteInput
                                                control={control}
                                                label="Empresa visitada"
                                                name="id_empresa_visitada"
                                                variant={disabledForm ? 'flat' : 'bordered'}
                                                items={empresas_visitadas}
                                                size="md"
                                                rules={{ required: 'Campo obligatorio' }} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextareaInput
                                                control={control}
                                                name="personal_visita"
                                                label="Nombre(s) del personal a visitar"
                                                variant={disabledForm ? 'flat' : 'bordered'}
                                                readOnly={disabledForm}
                                                rules={{ required: 'Campo obligatorio' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <AutocompleteInput
                                                control={control}
                                                label="Áreas a visitar"
                                                name="areas"
                                                items={areas}
                                                variant={disabledForm ? 'flat' : 'bordered'}
                                                size="md"
                                                rules={{ required: 'Campo obligatorio' }}
                                            />
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12} sm={6} md={8}>
                                    <TextareaInput
                                        control={control}
                                        name="motivo"
                                        label={`Motivo de ${tipo_movimiento}`}
                                        placeholder="Ingresa una descripción del motivo"
                                        variant={disabledForm ? 'flat' : 'bordered'}
                                        isReadOnly={disabledForm}
                                        rules={{ required: 'Campo obligatorio' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Controller
                                        name="ingresa_mercancia"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: 'Campo obligatorio' }}
                                        render={({ field, fieldState }) => (
                                            <RadioGroup
                                                label="¿Ingresa con equipo/mercancía/material?"
                                                orientation="horizontal"
                                                className="mb-3"
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                isDisabled={disabledForm}
                                                isInvalid={fieldState.invalid}
                                                errorMessage={fieldState.error?.message}
                                            >
                                                <Radio value="si">Sí</Radio>
                                                <Radio value="no">No</Radio>
                                            </RadioGroup>
                                        )}
                                    />
                                    {ingresa_mercancia === 'si' && (
                                        <TextareaInput
                                            control={control}
                                            label="Descripción"
                                            name="mercancia_ingresada"
                                            placeholder="Ingresar descripción"
                                            variant={disabledForm ? 'flat' : 'bordered'}
                                            rules={{
                                                required: 'Campo obligatorio'
                                            }}
                                        />
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                    <Controller
                                        name="egresa_mercancia"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: 'Campo obligatorio' }}
                                        render={({ field, fieldState }) => (
                                            <RadioGroup
                                                label="¿Sale con equipo/mercancía/material?"
                                                orientation="horizontal"
                                                className="mb-3"
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                isDisabled={disabledForm}
                                                isInvalid={fieldState.invalid}
                                                errorMessage={fieldState.error?.message}
                                            >
                                                <Radio value="si">Sí</Radio>
                                                <Radio value="no">No</Radio>
                                            </RadioGroup>
                                        )}
                                    />
                                    {egresa_mercancia === 'si' && (
                                        <TextareaInput
                                            control={control}
                                            label="Descripción"
                                            name="mercancia_egresada"
                                            placeholder="Ingresar descripción"
                                            variant={disabledForm ? 'flat' : 'bordered'}
                                            rules={{
                                                required: 'Campo obligatorio'
                                            }}
                                        />
                                    )}
                                </Grid>

                            </Grid>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                        </CardFooter>
                    </Card>

                    <ModuloVehiculo></ModuloVehiculo>

                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader
                            style={{
                                background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                            <div className="flex flex-col">
                                <p className="text-md">Notas vigilancia</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <TextareaInput
                                control={control}
                                name="notas"
                                label="Notas para vigilancia"
                                variant={disabledForm ? 'flat' : 'bordered'}
                                placeholder="Ingresa tus notas para el personal de vigilancia" />
                        </CardBody>
                        <Divider />
                        <CardFooter>
                        </CardFooter>
                    </Card>

                    <Card className="mt-3">
                        <CardHeader
                            style={{
                                background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                            <div className="flex flex-col">
                                <p className="text-md">Historial de cambios</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <HistorialCambios cambios={mails || []} />
                        </CardBody>
                        <Divider />
                        <CardFooter>
                        </CardFooter>
                    </Card>

                    {id_acceso && (
                        <Card className="mt-2">
                            <CardHeader style={{
                                background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
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

            <ListadoEmpresas
                open={openEmpresas}
                handleClose={cerrarEmpresas}
                setValue={setValue}
            />

            {id_acceso && (
                <Validador
                    id_acceso={id_acceso}
                    estado_acceso={estado_acceso}
                    open={OpenValidador}
                    handleClose={handleCloseValidador}
                />
            )}
        </>);
};

export default AccesoForm;