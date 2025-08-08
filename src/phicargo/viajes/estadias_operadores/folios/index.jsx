import { Avatar, Badge, Card, CardBody, CardHeader, Divider, Input } from "@heroui/react";
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Spinner } from "@heroui/react";
import { ViajeContext } from '../../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CostosExtrasContext } from "@/phicargo/costos/context/context";
import { Button } from "@heroui/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { NumberInput } from "@heroui/react";
import ListViajes from "../viajes_modal";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Box } from '@mui/material';
import { TextField, MenuItem } from '@mui/material';
import { Select, SelectItem } from "@heroui/react";
import Stack from '@mui/material/Stack';
import { DatePicker } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import dayjs from 'dayjs';
import { Progress } from "@heroui/react";

function EstadiasOperadores({ open, handleClose, datapago }) {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isLoadingRegistro, setLoadingRegistro] = useState(false);

    const [horas_pagar, setHorasPagar] = useState(0);
    const [total, setTotal] = useState(0);
    const [motivo, setMotivo] = useState("");

    const today = new Date();
    const todayString = today.toISOString().slice(0, 10);
    const [value, setValue] = React.useState(parseDate(todayString));

    const handleSelectionChange = (e) => setMotivo(e.target.value);

    const fetchData = async () => {
        if (!data[0]?.id_viaje) return;
        toast.info('Obteniendo datos de viaje');

        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/reporte_estadias/', {
                params: { travel_id: data[0].id_viaje },
            });
            const info = response.data[0];
            setData(info);
            setHorasPagar(info.horas_planta - info.horas_estadias);
            setTotal((info.horas_planta - info.horas_estadias) * 62.50);
            setMotivo("");
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            toast.error('Error al obtener los datos.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPago = async () => {
        if (datapago.id_pago == null) {
            return;
        }

        try {
            toast.info('Obteniendo folio: ' + datapago.id_pago);
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/pagos_estadias_operadores/by_id_pago/${datapago.id_pago}`);
            const info = response.data;
            setData(info);
            setHorasPagar(info.horas_pagar);
            setTotal(info.total);
            setMotivo(info.motivo);
            setValue(parseDate(info.fecha));
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            toast.error('Error al obtener el pago.');
        } finally {
            setLoading(false);
        }
    };

    const registrar_pago_estadia = async () => {
        console.log('registrar maniobra' + data);
        if (
            !horas_pagar || horas_pagar < 0 ||
            !total || total < 0 ||
            !motivo
        ) {
            if (!horas_pagar) toast.error('Ingresa un valor para las horas a pagar.');
            if (horas_pagar < 0) toast.error('Las horas a pagar no pueden ser negativas.');
            if (!total) toast.error('Ingresa un valor para el total.');
            if (total < 0) toast.error('El total no puede ser negativo.');
            if (!motivo) toast.error('Ingresa un motivo de pago de estadías.');
            return;
        }

        const payload = {
            id_viaje: data?.travel_id,
            fecha: dayjs(value).format('YYYY-MM-DD'),
            horas_pagar,
            total,
            motivo,
        };

        try {
            setLoadingRegistro(true);
            toast.warning('Registrando pago...');
            const response = await odooApi.post('/tms_travel/pagos_estadias_operadores/create/', payload);
            if (response.data.status === "success") {
                toast.success(`${response.data.message}, Folio: ${response.data.data.id_pago}`);
                handleClose();
            }
        } catch (error) {
            toast.error('Error al registrar el pago: ' + error.message);
        } finally {
            setLoadingRegistro(false);
        }
    };

    const actualizar_pago = async () => {

        const payload = {
            id_viaje: data?.id_viaje,
            fecha: dayjs(value).format('YYYY-MM-DD'),
            horas_pagar,
            total,
            motivo
        };

        try {
            setLoadingRegistro(true);
            toast.info('Actualizando folio...');
            const response = await odooApi.patch(`/tms_travel/pagos_estadias_operadores/update/${datapago.id_pago}`, payload);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                handleClose();
            }
        } catch (error) {
            toast.error('Error al actualizar el pago: ' + error.message);
        } finally {
            setLoadingRegistro(false);
        }
    };

    const confirmar_pago = async () => {
        try {
            setLoadingRegistro(true);
            toast.warning('Confirmando folio...');
            const response = await odooApi.post(`/tms_travel/pagos_estadias_operadores/confirmar/${datapago.id_pago}`);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                handleClose();
            }
        } catch (error) {
            toast.error('Error al confirmar el pago: ' + error.message);
        } finally {
            setLoadingRegistro(false);
        }
    };

    const pagar_folio = async () => {
        try {
            setLoadingRegistro(true);
            toast.warning('Cambiando estado a folio...');
            const response = await odooApi.post(`/tms_travel/pagos_estadias_operadores/pagar/${datapago.id_pago}`);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                handleClose();
            }
        } catch (error) {
            toast.error('Error al confirmar el pago: ' + error.message);
        } finally {
            setLoadingRegistro(false);
        }
    };

    const cancelar_pago = async () => {
        try {
            setLoadingRegistro(true);
            toast.warning('Cancelando folio...');
            const response = await odooApi.post(`/tms_travel/pagos_estadias_operadores/cancelar/${datapago.id_pago}`);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                handleClose();
            }
        } catch (error) {
            toast.error('Error al confirmar el pago: ' + error.message);
        } finally {
            setLoadingRegistro(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [data]);

    useEffect(() => {
        if (datapago != null) {
            fetchPago();
        } else {
            setData([]);
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
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '30px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.0)',
                    },
                }}
            >
                <DialogTitle>
                    Calculo de pago de estadias
                </DialogTitle>
                {isLoading && (
                    <Progress isIndeterminate aria-label="Loading..." size="sm" />
                )}
                <DialogContent>
                    <Stack spacing={1} direction="row">

                        {(datapago == "" || datapago == null) && (
                            <Button color="primary" onPress={registrar_pago_estadia} isLoading={isLoadingRegistro}>
                                Registrar pago
                            </Button>
                        )}

                        {datapago && data.estado === 'borrador' && (
                            <Button
                                color="success"
                                onPress={actualizar_pago}
                                isLoading={isLoadingRegistro}
                                className="text-white"
                            >
                                Actualizar
                            </Button>
                        )}

                        {data.estado == 'borrador' && (
                            <Button color="danger" onPress={cancelar_pago} isLoading={isLoadingRegistro}>
                                Cancelar pago
                            </Button>
                        )}

                        {data.estado == 'borrador' && (
                            <Button color="warning" onPress={confirmar_pago} isLoading={isLoadingRegistro} className="text-white">
                                Confirmar pago
                            </Button>
                        )}

                        {data.estado == 'confirmado' && (
                            <Button color="success" onPress={pagar_folio} isLoading={isLoadingRegistro} className="text-white">
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
                                <Button onPress={handleClickOpenEO} color="primary" size="sm" fullWidth>Ingresar viaje</Button>
                            </Stack>
                        </CardHeader>
                        <Divider></Divider>
                        <CardBody>
                            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                <Input label="Folio No." value={datapago?.id_pago} />
                                <Input label="Viaje" value={data?.travel_name} />
                                <Input label="Operador" value={data?.employee_name} />
                                <Input label="Cartas porte" value={data?.cartas_porte} />
                                <DatePicker label="Fecha" value={value} onChange={setValue}
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
                                        <TableCell>{data?.llegada_planta}</TableCell>
                                        <TableCell>{data?.salida_planta}</TableCell>
                                        <TableCell>{data?.horas_planta}</TableCell>
                                        <TableCell>{data?.horas_estadias}</TableCell>
                                        <TableCell>
                                            <NumberInput
                                                isDisabled={true}
                                                className="max-w-xs"
                                                defaultValue={horas_pagar}
                                                value={horas_pagar}
                                                onValueChange={setHorasPagar}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <NumberInput
                                                isDisabled={true}
                                                className="max-w-xs"
                                                defaultValue={horas_pagar * 62.50}
                                                value={total}
                                                onValueChange={setTotal} />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                fullWidth
                                                className="min-w-[200px]"
                                                isDisabled={data?.estado == 'confirmado' ? true : false}
                                                label="Motivo"
                                                selectedKeys={[motivo]}
                                                variant="flat"
                                                onChange={handleSelectionChange}
                                            >
                                                <SelectItem key={"demora_descarga"}>Demora en descarga</SelectItem>
                                                <SelectItem key={"demora_carga"}>Demora en Carga</SelectItem>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>

                </DialogContent>
            </Dialog >

            <ListViajes open={openOP} handleClose={handleCloseEO} setDataTravel={setData}></ListViajes>
        </>
    );
}

export default EstadiasOperadores;
