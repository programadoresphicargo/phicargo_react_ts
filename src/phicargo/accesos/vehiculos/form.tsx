import { Grid } from "@mui/material";
import { Button, Checkbox, Input, Progress } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";

type Vehiculo = {
    id_vehiculo?: number;
    marca: string;
    modelo: string;
    placas: string;
    tipo_vehiculo: string;
    color: string;
    contenedor1: string;
    contenedor2: string;
    utilitario: boolean;
}

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
        } catch (error) {
            toast.error("Error enviando los datos: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (<>
        <Grid container spacing={2} className="mb-5">
            <Grid item xs={12}>
                <Button color="primary" onPress={() => handleSubmit(registrar_vehiculo)()} isLoading={isLoading} radius="full">
                    {id_vehiculo ? "Actualizar" : "Registrar"}
                </Button>
            </Grid>

            {isLoading && (
                <Progress isIndeterminate aria-label="Loading..." size="sm" />
            )}

            <Grid item xs={12} md={6}>
                <Controller
                    control={control}
                    name="marca"
                    rules={{ required: "Marca es requerido" }}
                    render={({ field, fieldState }) => (
                        <Input
                            fullWidth
                            variant="bordered"
                            label="Marca"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            isInvalid={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    control={control}
                    name="modelo"
                    rules={{ required: "Modelo es requerido" }}
                    render={({ field, fieldState }) => (
                        <Input
                            fullWidth
                            variant="bordered"
                            label="Modelo"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            isInvalid={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    control={control}
                    name="placas"
                    rules={{ required: "Placas es requerido" }}
                    render={({ field, fieldState }) => (
                        <Input
                            fullWidth
                            variant="bordered"
                            label="Placas"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            isInvalid={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    control={control}
                    name="tipo_vehiculo"
                    rules={{ required: "Tipo de vehiculo es requerido" }}
                    render={({ field, fieldState }) => (
                        <Select
                            variant="bordered"
                            selectedKeys={field.value ? [field.value] : []}
                            onSelectionChange={(keys) => {
                                field.onChange(Array.from(keys)[0]);
                            }}
                            label="Tipo de vehiculo"
                            isInvalid={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
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
                    rules={{ required: "Color es requerido" }}
                    render={({ field, fieldState }) => (
                        <Input
                            fullWidth
                            variant="bordered"
                            label="Color"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            isInvalid={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    control={control}
                    name="contenedor1"
                    render={({ field }) => (
                        <Input
                            fullWidth
                            variant="bordered"
                            label="Referencia contenedor 1"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
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
                            fullWidth
                            variant="bordered"
                            label="Referencia contenedor 2"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    control={control}
                    name="utilitario"
                    render={({ field }) => (
                        <Checkbox
                            onValueChange={val => field.onChange(val)}
                            isSelected={field.value ?? false}>
                            Vehículo utilitario
                        </Checkbox>
                    )}
                />
            </Grid>
        </Grid>
    </>
    );
};

export default VehiculoForm;
