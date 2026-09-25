import { Button, Chip, DatePicker, Progress } from "@heroui/react";
import { Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { parseDate } from "@internationalized/date";
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
};

const initialForm: Saldo = {
    id_saldo: 0,
    id_cuenta: null,
    saldo: 0,
    disponible: 0,
    utilizado: 0,
    fecha: dayjs(),
};

const SaldoForm = ({
    id_cuenta,
    referencia,
    onClose,
}: {
    id_cuenta: number;
    referencia: string;
    onClose: () => void;
}) => {
    const {
        control,
        handleSubmit,
        reset,
        getValues,
    } = useForm<Saldo>({
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

            const response = await odooApi.post("/saldos/", payload);

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
        const fechaConsulta = fecha || getValues("fecha");

        if (!fechaConsulta) return;

        try {
            setLoadingSaldo(true);

            const response = await odooApi.get(
                `/saldos/fecha/${id_cuenta}/${fechaConsulta.format("YYYY-MM-DD")}`
            );

            if (response.data) {
                const saldoData = response.data;

                reset({
                    ...saldoData,
                    fecha: saldoData.fecha
                        ? dayjs(saldoData.fecha)
                        : fechaConsulta,
                });

                toast.success("Datos cargados correctamente.");
            } else {
                reset({
                    ...initialForm,
                    id_cuenta,
                    fecha: fechaConsulta,
                });
            }
        } catch (error: any) {
            toast.error(
                "Error al obtener los datos: " + error.message
            );
        } finally {
            setLoadingSaldo(false);
        }
    };

    useEffect(() => {
        if (id_cuenta) {
            reset({
                ...initialForm,
                id_cuenta,
                fecha: dayjs(),
            });

            getSaldoCuentaByFecha();
        }
    }, [id_cuenta]);

    return (
        <Grid container spacing={2.5} className="mb-2">
            {/* Encabezado */}
            <Grid item xs={12}>
                <div className="rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002887]/10">
                                <i className="bi bi-wallet2 text-lg text-[#002887]" />
                            </div>

                            <div>
                                <h2
                                    className="text-sm font-semibold text-slate-800"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                >
                                    Actualización de saldo
                                </h2>

                                <p
                                    className="text-xs text-slate-500"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                >
                                    Registra el saldo disponible de la cuenta
                                </p>
                            </div>
                        </div>

                        <Chip
                            color="primary"
                            variant="flat"
                            size="sm"
                            className="font-medium"
                        >
                            Cuenta · {referencia}
                        </Chip>
                    </div>
                </div>
            </Grid>

            {/* Cargando saldo */}
            {loadingSaldo && (
                <Grid item xs={12}>
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                        <Progress
                            isIndeterminate
                            label="Obteniendo saldo..."
                            size="sm"
                            className="text-xs"
                        />
                    </div>
                </Grid>
            )}

            {/* Información */}
            <Grid item xs={12}>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <i className="bi bi-clipboard-data text-[#002887]" />

                        <div>
                            <h3
                                className="text-sm font-semibold text-slate-800"
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                }}
                            >
                                Información del saldo
                            </h3>

                            <p
                                className="text-xs text-slate-500"
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                }}
                            >
                                Consulta o actualiza los valores correspondientes
                            </p>
                        </div>
                    </div>

                    <Grid container spacing={2}>
                        {/* Fecha */}
                        <Grid item xs={12} md={4}>
                            <Controller
                                control={control}
                                name="fecha"
                                rules={{
                                    required: "Fecha",
                                }}
                                render={({ field, fieldState }) => {
                                    const calendarValue =
                                        field.value
                                            ? parseDate(
                                                field.value.format(
                                                    "YYYY-MM-DD"
                                                )
                                            )
                                            : null;

                                    return (
                                        <DatePicker
                                            label="Fecha"
                                            variant="bordered"
                                            value={calendarValue}
                                            onChange={async (val) => {
                                                const nuevaFecha = val
                                                    ? dayjs(val.toString())
                                                    : null;

                                                field.onChange(nuevaFecha);

                                                if (nuevaFecha) {
                                                    await getSaldoCuentaByFecha(
                                                        nuevaFecha
                                                    );
                                                }
                                            }}
                                            isInvalid={
                                                !!fieldState.error
                                            }
                                            errorMessage={
                                                fieldState.error?.message
                                            }
                                            isDisabled={loadingSaldo}
                                            classNames={{
                                                label: "text-xs font-medium",
                                            }}
                                        />
                                    );
                                }}
                            />
                        </Grid>

                        {/* Saldo */}
                        <Grid item xs={12} md={4}>
                            <NumberInput
                                control={control}
                                name="saldo"
                                label="Saldo"
                                variant="bordered"
                                rules={{
                                    required: "Obligatorio",
                                }}
                            />
                        </Grid>

                        {/* Disponible */}
                        <Grid item xs={12} md={4}>
                            <NumberInput
                                control={control}
                                name="disponible"
                                label="Disponible"
                                variant="bordered"
                                rules={{
                                    required: "Obligatorio",
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>
            </Grid>

            {/* Resumen */}
            <Grid item xs={12}>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                                <i className="bi bi-wallet2 text-blue-700" />
                            </div>

                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                    Saldo
                                </p>
                                <p className="text-sm font-semibold text-slate-800">
                                    $ {Number(getValues("saldo") || 0).toLocaleString(
                                        "es-MX",
                                        {
                                            minimumFractionDigits: 2,
                                        }
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                                <i className="bi bi-check-circle text-emerald-600" />
                            </div>

                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                    Disponible
                                </p>
                                <p className="text-sm font-semibold text-slate-800">
                                    $ {Number(
                                        getValues("disponible") || 0
                                    ).toLocaleString("es-MX", {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                                <i className="bi bi-graph-down-arrow text-amber-600" />
                            </div>

                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                    Utilizado
                                </p>
                                <p className="text-sm font-semibold text-slate-800">
                                    $ {Number(
                                        getValues("utilizado") || 0
                                    ).toLocaleString("es-MX", {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Grid>

            {/* Acciones */}
            <Grid item xs={12}>
                <div className="flex items-center justify-end border-t border-slate-200 pt-4">
                    <Stack
                        spacing={1.5}
                        direction="row"
                    >
                        <Button
                            color="primary"
                            onPress={() =>
                                handleSubmit(actualizarSaldo)()
                            }
                            isLoading={loading}
                            isDisabled={loadingSaldo}
                            radius="md"
                            startContent={
                                !loading ? (
                                    <i className="bi bi-save2-fill" />
                                ) : undefined
                            }
                            className="px-5 font-medium"
                        >
                            Actualizar saldo
                        </Button>
                    </Stack>
                </div>
            </Grid>
        </Grid>
    );
};

export default SaldoForm;