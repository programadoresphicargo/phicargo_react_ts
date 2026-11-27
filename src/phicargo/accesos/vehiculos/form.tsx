import { Box, Grid } from "@mui/material";
import { Button, Checkbox, Input, Progress } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { Vehiculo } from "../types/types";

type Props = {
    open: boolean,
    onClose: () => void,
    id_vehiculo?: number | null
};

const VehiculoForm: React.FC<Props> = ({
    open,
    onClose,
    id_vehiculo
}) => {

    const [isLoading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<Vehiculo>({
        defaultValues: {
            marca: "",
            modelo: "",
            placas: "",
            tipo_vehiculo: "",
            color: "",
            contenedor1: "",
            contenedor2: "",
            utilitario: false,
        },
    });

    const fetchData = async (id_vehiculo: number) => {
        try {
            const response = await odooApi.get('/vehiculos_visitantes/' + id_vehiculo);
            reset(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        if (open && id_vehiculo) {
            fetchData(id_vehiculo);
        } else {
            reset({
                marca: "",
                modelo: "",
                placas: "",
                tipo_vehiculo: "",
                color: "",
                contenedor1: "",
                contenedor2: "",
                utilitario: false,
            });
        }
    }, [open, id_vehiculo]);

    const registrar_vehiculo = async (data: Vehiculo) => {

        try {
            setLoading(true);
            let response;

            if (id_vehiculo) {
                response = await odooApi.patch("/vehiculos_visitantes/", data);
            } else {
                response = await odooApi.post("/vehiculos_visitantes/", data);
            }

            if (response.data.status === 'success') {
                toast.success(response.data.mensaje);
                onClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            if (error.response?.data?.detail) {
                toast.error(error.response.data.detail);
            } else {
                toast.error(
                    "Error al conectar con el servidor: " + error.message
                );
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <Box className="w-full">
            <Grid container spacing={2.5}>

                {/* ENCABEZADO Y ACCIONES */}
                <Grid item xs={12}>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <i className="bi bi-truck-front-fill text-xl"></i>
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-gray-800">
                                    Información del vehículo
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {id_vehiculo
                                        ? "Actualiza los datos y características del vehículo"
                                        : "Registra un nuevo vehículo en el sistema"}
                                </p>
                            </div>
                        </div>

                        <Button
                            color="primary"
                            onPress={() => handleSubmit(registrar_vehiculo)()}
                            isLoading={isLoading}
                            isDisabled={isLoading}
                            radius="lg"
                            className="bg-blue-700 px-6 font-semibold text-white shadow-sm hover:bg-blue-800"
                            startContent={
                                !isLoading && (
                                    <i className={`bi ${id_vehiculo ? "bi-arrow-repeat" : "bi-floppy"} text-base`}></i>
                                )
                            }
                        >
                            {id_vehiculo ? "Guardar cambios" : "Registrar vehículo"}
                        </Button>
                    </div>
                </Grid>

                {/* INDICADOR DE CARGA */}
                {isLoading && (
                    <Grid item xs={12}>
                        <Progress
                            aria-label="Guardando información"
                            isIndeterminate
                            size="sm"
                            color="primary"
                        />
                    </Grid>
                )}

                {/* INFORMACIÓN GENERAL */}
                <Grid item xs={12}>
                    <div className="mb-1 flex items-center gap-2">
                        <i className="bi bi-card-text text-blue-700"></i>
                        <h4 className="text-sm font-bold text-gray-700">
                            Datos generales
                        </h4>
                    </div>
                    <p className="mb-3 text-xs text-gray-400">
                        Información de identificación del vehículo.
                    </p>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        control={control}
                        name="marca"
                        rules={{ required: "La marca es requerida" }}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                fullWidth
                                variant="bordered"
                                label="Marca"
                                placeholder="Ej. Freightliner"
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                                radius="lg"
                                size="sm"
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        control={control}
                        name="modelo"
                        rules={{ required: "El modelo es requerido" }}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                fullWidth
                                variant="bordered"
                                label="Modelo"
                                size="sm"
                                placeholder="Ej. Cascadia 2025"
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                                radius="lg"
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        control={control}
                        name="placas"
                        rules={{ required: "Las placas son requeridas" }}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                fullWidth
                                variant="bordered"
                                label="Placas"
                                placeholder="Ej. XX-1234-A"
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                                radius="lg"
                                size="sm"
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        control={control}
                        name="tipo_vehiculo"
                        rules={{ required: "El tipo de vehículo es requerido" }}
                        render={({ field, fieldState }) => (
                            <Select
                                variant="bordered"
                                label="Tipo de vehículo"
                                placeholder="Selecciona una categoría"
                                selectedKeys={field.value ? [field.value] : []}
                                onSelectionChange={(keys) => {
                                    field.onChange(Array.from(keys)[0] ?? "");
                                }}
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                                radius="lg"
                                size="sm"
                            >
                                <SelectItem key="tractocamion">Tractocamión</SelectItem>
                                <SelectItem key="pipa">Pipa</SelectItem>
                                <SelectItem key="automovil">Automóvil</SelectItem>
                                <SelectItem key="motocicleta">Motocicleta</SelectItem>
                                <SelectItem key="camion">Camión</SelectItem>
                                <SelectItem key="grua">Grúa</SelectItem>
                            </Select>
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        control={control}
                        name="color"
                        rules={{ required: "El color es requerido" }}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                size="sm"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                fullWidth
                                variant="bordered"
                                label="Color"
                                placeholder="Ej. Blanco"
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                                radius="lg"
                            />
                        )}
                    />
                </Grid>

                {/* CONTENEDORES */}
                <Grid item xs={12}>
                    <div className="mb-1 mt-3 flex items-center gap-2 border-t border-gray-100 pt-5">
                        <i className="bi bi-box-seam text-blue-700"></i>
                        <h4 className="text-sm font-bold text-gray-700">
                            Referencias de contenedores
                        </h4>
                    </div>
                    <p className="mb-3 text-xs text-gray-400">
                        Asocia las referencias de los contenedores correspondientes.
                    </p>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        control={control}
                        name="contenedor1"
                        render={({ field }) => (
                            <Input
                                {...field}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                fullWidth
                                size="sm"
                                variant="bordered"
                                label="Contenedor 1"
                                placeholder="Referencia del contenedor"
                                radius="lg"
                                startContent={
                                    <i className="bi bi-box text-gray-400"></i>
                                }
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        control={control}
                        name="contenedor2"
                        render={({ field }) => (
                            <Input
                                {...field}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                fullWidth
                                size="sm"
                                variant="bordered"
                                label="Contenedor 2"
                                placeholder="Referencia del contenedor"
                                radius="lg"
                                startContent={
                                    <i className="bi bi-box text-gray-400"></i>
                                }
                            />
                        )}
                    />
                </Grid>

                {/* CONFIGURACIÓN ADICIONAL */}
                <Grid item xs={12}>
                    <div className="mt-3 border-t border-gray-100 pt-5">
                        <h4 className="mb-3 text-sm font-bold text-gray-700">
                            Configuración adicional
                        </h4>

                        <Controller
                            control={control}
                            name="utilitario"
                            render={({ field }) => (
                                <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                                            <i className="bi bi-car-front-fill text-lg"></i>
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">
                                                Vehículo utilitario
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Identificar como vehículo de uso utilitario.
                                            </p>
                                        </div>
                                    </div>

                                    <Checkbox
                                        isSelected={field.value ?? false}
                                        onValueChange={field.onChange}
                                        color="primary"
                                    />
                                </div>
                            )}
                        />
                    </div>
                </Grid>

            </Grid>
        </Box>
    );
}

export default VehiculoForm;
