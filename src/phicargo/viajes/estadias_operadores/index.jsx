import { Avatar, Badge, Card, CardHeader } from "@heroui/react";
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Spinner } from "@heroui/react";
import { ViajeContext } from '../context/viajeContext';
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
import { Select, SelectItem } from "@heroui/react";
import { NumberInput } from "@heroui/react";
import ListViajes from "./viajes_modal";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Box } from '@mui/material';

function EstadiasOperadores({ open, handleClose, datapago }) {

    const context = useContext(CostosExtrasContext);
    const CartasPorte = context?.CartasPorte || [];

    const [data, setData] = useState([]);
    const [dataTravel, setDataTravel] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isLoadingRegistro, setLoadingRegistro] = useState(false);

    const [horas_pagar, setHorasPagar] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const [motivo, setMotivo] = React.useState("");

    const handleSelectionChange = (e) => {
        setMotivo(e.target.value);
    };

    const fetchData = async () => {

        var travel_id = 0;
        if (CartasPorte.length === 0) {
            travel_id = datapago.id_viaje;
        } else {
            console.log(CartasPorte[0]?.travel_id);
            travel_id = CartasPorte[0]?.travel_id;
        }

        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/reporte_estadias/', {
                params: { travel_id: dataTravel[0]?.id_viaje },
            });
            setData(response.data[0]);
            setHorasPagar(response.data[0].horas_planta - response.data[0].horas_estadias);
            setTotal(0);
            setMotivo("");
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPago = async () => {
        toast.success('Obteniendo pago');
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/pagos_estadias_operadores/by_id_pago/' + datapago.id_pago);
            setData(response.data);
            setHorasPagar(response.data.horas_pagar);
            setTotal(response.data.total);
            setMotivo(response.data.motivo);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const registrar_pago_estadia = async () => {

        if (horas_pagar == 0) {
            toast.error('Ingresa un valor para las horas a pagar.')
            return;
        }

        if (total == 0) {
            toast.error('Ingresa un valor para el total.')
            return;
        }

        if (motivo == "") {
            toast.error('Ingresa un motivo de pago de estadías.')
            return;
        }

        const data = {
            id_viaje: CartasPorte[0]?.travel_id,
            horas_pagar: horas_pagar,
            total: total,
            motivo: motivo
        }

        try {
            toast.warning('Registrando pago.')
            setLoadingRegistro(true);
            const response = await odooApi.post('/tms_travel/pagos_estadias_operadores/create/', data);
            if (response.data.status == "success") {
                toast.success(response.data.message + ", Folio: " + response.data.data.id_pago);
                handleClose();
            }
            setLoadingRegistro(false);
        } catch (error) {
            toast.error('Error al obtener los datos:' + error);
        } finally {
            setLoadingRegistro(false);
        }
    };

    const actualizar_pago = async () => {

        const data = {
            id_viaje: datapago.id_viaje,
            horas_pagar: horas_pagar,
            total: total,
            motivo: motivo
        }

        toast.warning('Actualizando pago.')
        try {
            setLoadingRegistro(true);
            const response = await odooApi.patch('/tms_travel/pagos_estadias_operadores/update/' + datapago.id_pago, data);
            if (response.data.status == "success") {
                toast.success(response.data.message);
                handleClose();
            }
            setLoadingRegistro(false);
        } catch (error) {
            toast.error('Error al obtener los datos:' + error);
        } finally {
            setLoadingRegistro(false);
        }
    };

    const confirmar_pago = async () => {
        toast.warning('Confirmando pago.')
        try {
            setLoadingRegistro(true);
            const response = await odooApi.post('/tms_travel/pagos_estadias_operadores/confirmar/' + datapago.id_pago);
            if (response.data.status == "success") {
                toast.success(response.data.message);
                handleClose();
            }
            setLoadingRegistro(false);
        } catch (error) {
            toast.error('Error al obtener los datos:' + error);
        } finally {
            setLoadingRegistro(false);
        }
    };

    useEffect(() => {
        if (CartasPorte.length != 0) {
            fetchData();
        }

        if (datapago) {
            fetchPago();
        }
    }, [open]);

    const [openOP, setOpenOP] = React.useState(false);

    const handleClickOpenEO = () => {
        setOpenOP(true);
    };

    const handleCloseEO = () => {
        setOpenOP(false);
        fetchData();
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Referencia',
            },
            {
                accessorKey: 'cartas_porte',
                header: 'Cartas porte',
            },
            {
                accessorKey: 'vehiculo',
                header: 'Vehiculo',
            },
            {
                accessorKey: 'operador',
                header: 'Operador',
            },
            {
                accessorKey: 'contenedores',
                header: 'Contenedores',
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: dataTravel,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        state: { showProgressBars: isLoading },
        enableColumnPinning: true,
        enableStickyHeader: true,
        positionGlobalFilter: "right",
        localization: MRT_Localization_ES,
        muiSearchTextFieldProps: {
            placeholder: `Buscar en ${data.length} viajes`,
            sx: { minWidth: '300px' },
            variant: 'outlined',
        },
        columnResizeMode: "onEnd",
        initialState: {
            showGlobalFilter: true,
            columnVisibility: {
                empresa: false,
            },
            density: 'compact',
            expanded: true,
            showColumnFilters: true,
            pagination: { pageSize: 80 },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        muiTableHeadCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'Bold',
                fontSize: '14px',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 210px)',
            },
        },
        muiTableBodyRowProps: (cell) => ({
            onClick: (event) => {
            },
        }),
        muiTableBodyCellProps: ({ row }) => ({
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
            },
        }),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <h1
                    className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
                >
                    Viaje estadia
                </h1>
                <Button onPress={handleClickOpenEO} color="primary">Añadir viaje</Button>
            </Box >
        ),
    });

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
                    {"Pago de estadias a operador"}
                </DialogTitle>
                <DialogContent>

                    <MaterialReactTable
                        table={table}
                    />

                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <>

                            <DialogActions>
                                <Button onPress={handleClose}>Cerrar</Button>

                                {!datapago && (
                                    <Button color="primary" onPress={registrar_pago_estadia} isLoading={isLoadingRegistro}>
                                        Registrar pago
                                    </Button>
                                )}

                                {datapago && (
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
                                    <Button color="danger" onPress={registrar_pago_estadia} isLoading={isLoadingRegistro}>
                                        Cancelar pago
                                    </Button>
                                )}

                                {data.estado == 'borrador' && (
                                    <Button color="success" onPress={confirmar_pago} isLoading={isLoadingRegistro} className="text-white">
                                        Confirmar pago
                                    </Button>
                                )}
                            </DialogActions>

                            <p>Folio No.: {datapago?.id_pago}</p>
                            <p>VIAJE: {data?.travel_name}</p>
                            <p className="mb-5">OPERADOR: {data?.employee_name}</p>

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
                                                className="max-w-xs"
                                                defaultValue={horas_pagar}
                                                value={horas_pagar}
                                                onValueChange={setHorasPagar}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <NumberInput className="max-w-xs"
                                                defaultValue={total}
                                                value={total}
                                                onValueChange={setTotal} />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                className="max-w-xs"
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
                        </>)}

                </DialogContent>
            </Dialog >

            <ListViajes open={openOP} handleClose={handleCloseEO} setDataTravel={setDataTravel}></ListViajes>
        </>
    );
}

export default EstadiasOperadores;
