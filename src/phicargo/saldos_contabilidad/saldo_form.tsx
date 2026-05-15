import { Button, Chip, DatePicker } from "@heroui/react";
import { Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { parseDate } from "@internationalized/date";
import { Progress } from "@heroui/react";
import odooApi from "@/api/odoo-api";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { NumberInput } from "@/components/inputs";
import dayjs, { Dayjs } from "dayjs";

type Saldo = {
    id_saldo: number | null;
    id_cuenta: number | null;
    saldo: number;
    disponible: number;
    utilizado: number;
    fecha: Dayjs | null;
}

const initialForm: Saldo = {
    id_saldo: 0,
    id_cuenta: null,
    saldo: 0,
    disponible: 0,
    utilizado: 0,
    fecha: dayjs()
};

const SaldoForm = ({ id_cuenta, referencia, onClose }: { id_cuenta: number, referencia: string, onClose: () => void }) => {

    const { control, handleSubmit, reset, getValues } = useForm<Saldo>({
        defaultValues: initialForm,
    });

    const [loading, setLoading] = useState(false);
    const [loadingSaldo, setLoadingSaldo] = useState(false);

    const actualizarSaldo = async (data: Saldo) => {

        const payload = {
            ...data,
            fecha: data.fecha?.format("YYYY-MM-DD"),
        };

        try {
            setLoading(true);
            const response = await odooApi.patch(`/saldos/`, payload);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                onClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            toast.error("Error de conexión: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getSaldoCuentaByFecha = async (fecha?: Dayjs | null) => {

        const fechaConsulta =
            fecha || getValues("fecha");

        if (!fechaConsulta) return;

        try {
            setLoadingSaldo(true);
            const response = await odooApi.get(
                `/saldos/get_saldo_by_cuenta_and_fecha/${id_cuenta}/${fechaConsulta.format("YYYY-MM-DD")}`
            );
            if (response.data && response.data.length > 0) {
                const saldoData = response.data[0];
                reset({
                    ...saldoData,
                    fecha: saldoData.fecha ? dayjs(saldoData.fecha) : null,
                });
                toast.success("Datos cargados correctamente.");
            } else {
                reset({
                    ...initialForm,
                    id_cuenta,
                    fecha: fechaConsulta,
                });
                console.log("No se encontraron datos para la cuenta y fecha especificadas.");
            }
            setLoadingSaldo(false);
        } catch (error: any) {
            toast.error("Error al obtener los datos: " + error.message);
        } finally {
            setLoadingSaldo(false);
        }
    };

    useEffect(() => {
        if (id_cuenta) {
            getSaldoCuentaByFecha();
        }
    }, [id_cuenta]);

    return (
        <Grid container spacing={2} className="mb-5">
            <Grid item xs={12}>
                <Chip color="primary" size="lg">Cuenta - {referencia}</Chip>
                {loadingSaldo && (
                    <Progress
                        isIndeterminate
                        label="Obteniendo saldo..."
                        className="mt-3"
                        size="sm"
                    />
                )}
            </Grid>
            <Grid item xs={12}>
                <Controller
                    control={control}
                    name="fecha"
                    rules={{ required: "Fecha de incidencia requerida" }}
                    render={({ field, fieldState }) => {
                        const calendarValue =
                            field.value
                                ? parseDate(field.value.format("YYYY-MM-DD"))
                                : null;

                        return (
                            <DatePicker
                                label="Fecha de Incidencia"
                                variant="bordered"
                                value={calendarValue}
                                onChange={async (val) => {
                                    const nuevaFecha = val ? dayjs(val.toString()) : null;

                                    field.onChange(nuevaFecha);

                                    if (nuevaFecha) {
                                        await getSaldoCuentaByFecha(nuevaFecha);
                                    }
                                }}
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                            />
                        );
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <NumberInput
                    control={control}
                    name="saldo"
                    label="Saldo"
                    variant="bordered"
                    rules={{ required: 'Obligatorio' }} />
            </Grid>
            <Grid item xs={12}>
                <NumberInput
                    control={control}
                    name="disponible"
                    label="Disponible"
                    variant="bordered"
                    rules={{ required: 'Obligatorio' }} />
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={2} direction="row">
                    <Button color="primary" onPress={() => handleSubmit(actualizarSaldo)()}
                        isLoading={loading}
                        isDisabled={loadingSaldo}
                        radius="full">
                        Actualizar saldo
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default SaldoForm;
