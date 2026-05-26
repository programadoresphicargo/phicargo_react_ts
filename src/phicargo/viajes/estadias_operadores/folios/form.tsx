import { Card, CardBody, CardHeader, Divider, Input } from "@heroui/react";
import { useEffect, useState } from 'react';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@heroui/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import ListViajes from "../viajes_modal";
import Stack from '@mui/material/Stack';
import { DatePicker } from "@heroui/react";
import { Progress } from "@heroui/react";
import { Folio } from "./folios";
import { Controller, useForm } from "react-hook-form";
import { AutocompleteInput, NumberInput } from "@/components/inputs";
import { parseDate } from "@internationalized/date";
import dayjs from "dayjs";

const initialForm: Folio = {
    id_viaje: null,
    horas_pagar: 0,
    total: 0,
    estado: "borrador",
    motivo: "",
    fecha: dayjs(),
};

function EstadiasOperadores({ open, handleClose, datapago }: { open: boolean, handleClose: () => void, datapago: Folio | null }) {

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue
    } = useForm<Folio>({
        defaultValues: initialForm,
    });

    const [isLoading, setLoading] = useState(false);
    const [isLoadingRegistro, setLoadingRegistro] = useState(false);

    const id_viaje = watch("id_viaje");
    const estado = watch("estado");

    const fetchData = async () => {
        if (datapago?.id_pago != null) return;
        toast.info('Obteniendo datos de viaje');

        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/reporte_estadias/', {
                params: { travel_id: id_viaje },
            });
            const info = response.data[0];
            reset({
                ...response.data[0],
                id_viaje: info.travel_id,
                horas_pagar: info.horas_planta - info.x_horas_estadias,
                total: (info.horas_planta - info.x_horas_estadias) * 62.50,
            })
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            toast.error('Error al obtener los datos.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPago = async () => {
        if (datapago?.id_pago == null) {
            reset(initialForm);
            return;
        }
        try {
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/pagos_estadias_operadores/id_pago/${datapago.id_pago}`);
            reset(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            toast.error('Error al obtener el pago.');
        } finally {
            setLoading(false);
        }
    };

    const registrar = async (data: Folio) => {
        try {

            const payload = {
                ...data,
                fecha: data.fecha?.format("YYYY-MM-DD"),
            };

            setLoadingRegistro(true);
            const response = await odooApi.post('/tms_travel/pagos_estadias_operadores/', payload);
            if (response.data.status === "success") {
                toast.success(`${response.data.message}, Folio: ${response.data.data.id_pago}`);
                handleClose();
            }
        } catch (error: any) {
            toast.error('Error al registrar el pago: ' + error.message);
        } finally {
            setLoadingRegistro(false);
        }
    };

    const actualizar = async (data: Folio) => {
        try {
            setLoadingRegistro(true);
            const response = await odooApi.patch(`/tms_travel/pagos_estadias_operadores/${datapago?.id_pago}`, data);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                handleClose();
            }
        } catch (error: any) {
            toast.error('Error al actualizar el pago: ' + error.message);
        } finally {
            setLoadingRegistro(false);
        }
    };

    const confirmar_pago = async () => {
        try {
            setLoadingRegistro(true);
            toast.warning('Confirmando folio...');
            const response = await odooApi.post(`/tms_travel/pagos_estadias_operadores/confirmar/${datapago?.id_pago}`);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                handleClose();
            }
        } catch (error: any) {
            toast.error('Error al confirmar el pago: ' + error.message);
        } finally {
            setLoadingRegistro(false);
        }
    };

    const pagar_folio = async () => {
        try {
            setLoadingRegistro(true);
            toast.warning('Cambiando estado a folio...');
            const response = await odooApi.post(`/tms_travel/pagos_estadias_operadores/pagar/${datapago?.id_pago}`);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                handleClose();
            }
        } catch (error: any) {
            toast.error('Error al confirmar el pago: ' + error.message);
        } finally {
            setLoadingRegistro(false);
        }
    };

    const cancelar_pago = async () => {
        try {
            setLoadingRegistro(true);
            toast.warning('Cancelando folio...');
            const response = await odooApi.post(`/tms_travel/pagos_estadias_operadores/cancelar/${datapago?.id_pago}`);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                handleClose();
            }
        } catch (error: any) {
            toast.error('Error al confirmar el pago: ' + error.message);
        } finally {
            setLoadingRegistro(false);
        }
    };

    useEffect(() => {
        if (id_viaje != null) {
            fetchData();
        }
    }, [id_viaje]);

    useEffect(() => {
        if (open) {
            fetchPago();
        }
    }, [open]);

    const [openOP, setOpenOP] = useState(false);

    const handleClickOpenEO = () => setOpenOP(true);

    const handleCloseEO = () => {
        setOpenOP(false);
    };

    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth={"xl"}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    Calculo de pago de estadias
                </DialogTitle>
                {isLoading && (
                    <Progress isIndeterminate aria-label="Loading..." size="sm" />
                )}
                <DialogContent>
                    <Stack spacing={1} direction="row">

                        {datapago == null && (
                            <Button color="primary" onPress={() => handleSubmit(registrar)()} isLoading={isLoadingRegistro} radius="full">
                                Registrar pago
                            </Button>
                        )}

                        {datapago && estado === 'borrador' && (
                            <Button
                                color="success"
                                onPress={() => handleSubmit(actualizar)()}
                                isLoading={isLoadingRegistro}
                                className="text-white"
                                radius="full"
                            >
                                Actualizar
                            </Button>
                        )}

                        {datapago && estado == 'borrador' && (
                            <Button color="danger" onPress={cancelar_pago} isLoading={isLoadingRegistro} radius="full">
                                Cancelar pago
                            </Button>
                        )}

                        {datapago && estado == 'borrador' && (
                            <Button color="warning" onPress={confirmar_pago} isLoading={isLoadingRegistro} className="text-white" radius="full">
                                Confirmar pago
                            </Button>
                        )}

                        {estado == 'confirmado' && (
                            <Button color="success" onPress={pagar_folio} isLoading={isLoadingRegistro} className="text-white" radius="full">
                                Pagar
                            </Button>
                        )}
                    </Stack>

                    <Card className="mt-2">
                        <CardHeader>
                            <Stack spacing={1} direction="row">
                                <h1
                                    className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
                                >
                                    Viaje
                                </h1>
                                {!datapago && estado === 'borrador' && (
                                    <Button onPress={handleClickOpenEO} color="primary" size="sm" fullWidth radius="full">Ingresar viaje</Button>
                                )}
                            </Stack>
                        </CardHeader>
                        <Divider></Divider>
                        <CardBody>
                            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                <Input label="Folio No." value={watch("id_pago")?.toString() ?? ""} readOnly />
                                <Input label="Estado:" value={watch("estado")?.toString() ?? ""} readOnly />
                                <Input label="Viaje" value={String(watch("travel_name") ?? "")} readOnly />
                                <Input label="Operador" value={String(watch("employee_name") ?? "")} readOnly />
                                <Input label="Cartas porte" value={String(watch("cartas_porte") ?? "")} readOnly />
                                <Controller
                                    control={control}
                                    name="fecha"
                                    render={({ field, fieldState }) => {
                                        const calendarValue =
                                            field.value
                                                ? parseDate(dayjs(field.value).format('YYYY-MM-DD'))
                                                : null;

                                        return (
                                            <DatePicker
                                                variant="flat"
                                                label="Fecha"
                                                value={calendarValue}
                                                isDisabled={(estado === "confirmado" || estado === "pagado") ? true : false}
                                                onChange={(val) => {
                                                    field.onChange(val ? dayjs(val.toString()) : null);
                                                }}
                                                isInvalid={!!fieldState.error}
                                                errorMessage={fieldState.error?.message}
                                            />
                                        );
                                    }}
                                />
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="mt-2">
                        <CardHeader>
                            <h1
                                className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
                            >
                                Calculo de pago de estadias
                            </h1>
                        </CardHeader>
                        <Divider></Divider>
                        <CardBody>
                            <Table aria-label="Example static collection table">
                                <TableHeader>
                                    <TableColumn>Llegada a planta</TableColumn>
                                    <TableColumn>Salida de planta</TableColumn>
                                    <TableColumn>Horas en planta</TableColumn>
                                    <TableColumn>Horas libres</TableColumn>
                                    <TableColumn>Horas a pagar</TableColumn>
                                    <TableColumn>Total</TableColumn>
                                    <TableColumn>Motivo</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key="1">
                                        <TableCell>{watch("llegada_planta")}</TableCell>
                                        <TableCell>{watch("salida_planta")}</TableCell>
                                        <TableCell>{watch("horas_planta")}</TableCell>
                                        <TableCell>{watch("x_horas_estadias")}</TableCell>
                                        < TableCell >
                                            <NumberInput
                                                control={control}
                                                label="Horas a pagar"
                                                name="horas_pagar"
                                                size="md"
                                                isDisabled={true}
                                                rules={{ required: "Campo obligatorio" }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <NumberInput
                                                control={control}
                                                label="Total"
                                                name="total"
                                                size="md"
                                                isDisabled={true}
                                                rules={{ required: "Campo obligatorio" }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <AutocompleteInput
                                                control={control}
                                                label="Motivo"
                                                name="motivo"
                                                size="md"
                                                isDisabled={(estado === "confirmado" || estado === "pagado") ? true : false}
                                                rules={{ required: "Campo obligatorio" }}
                                                items={[
                                                    { key: "demora_descarga", value: "Demora en descarga" },
                                                    { key: "demora_carga", value: "Demora en Carga" },
                                                    { key: "estadias_puerto", value: "Estadías en puerto" }
                                                ]}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>

                </DialogContent>
            </Dialog >

            <ListViajes open={openOP} handleClose={handleCloseEO} setDataViaje={setValue}></ListViajes>
        </>
    );
}

export default EstadiasOperadores;
