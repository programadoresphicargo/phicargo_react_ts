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
import { NumberInput } from "@heroui/react";
import ListViajes from "./viajes_modal";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Box } from '@mui/material';
import { TextField, MenuItem, Select } from '@mui/material';

function EstadiasOperadores({ open, handleClose, datapago }) {

    const context = useContext(CostosExtrasContext);
    const CartasPorte = context?.CartasPorte || [];

    const [data, setData] = useState([]);
    const [dataTravel, setDataTravel] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isLoadingRegistro, setLoadingRegistro] = useState(false);

    const [horas_pagar, setHorasPagar] = useState(0);
    const [total, setTotal] = useState(0);
    const [motivo, setMotivo] = useState("");

    const handleSelectionChange = (e) => setMotivo(e.target.value);

    const fetchData = async () => {
        if (!dataTravel[0]?.id_viaje) return;
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/reporte_estadias/', {
                params: { travel_id: dataTravel[0].id_viaje },
            });
            const info = response.data[0];
            setData(info);
            setHorasPagar(info.horas_planta - info.horas_estadias);
            setTotal(0);
            setMotivo("");
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            toast.error('Error al obtener los datos.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPago = async () => {
        if (!datapago?.id_pago) return;
        try {
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/pagos_estadias_operadores/by_id_pago/${datapago.id_pago}`);
            const info = response.data;
            setData(info);
            setHorasPagar(info.horas_pagar);
            setTotal(info.total);
            setMotivo(info.motivo);
            setDataTravel([info]); // ← este valor se usa para la tabla
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            toast.error('Error al obtener el pago.');
        } finally {
            setLoading(false);
        }
    };

    const registrar_pago_estadia = async () => {
        if (!horas_pagar || !total || !motivo) {
            if (!horas_pagar) toast.error('Ingresa un valor para las horas a pagar.');
            if (!total) toast.error('Ingresa un valor para el total.');
            if (!motivo) toast.error('Ingresa un motivo de pago de estadías.');
            return;
        }

        const data = {
            id_viaje: CartasPorte[0]?.travel_id,
            horas_pagar,
            total,
            motivo,
        };

        try {
            setLoadingRegistro(true);
            toast.warning('Registrando pago...');
            const response = await odooApi.post('/tms_travel/pagos_estadias_operadores/create/', data);
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
        const data = {
            id_viaje: datapago.id_viaje,
            horas_pagar,
            total,
            motivo
        };

        try {
            setLoadingRegistro(true);
            toast.warning('Actualizando pago...');
            const response = await odooApi.patch(`/tms_travel/pagos_estadias_operadores/update/${datapago.id_pago}`, data);
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
            toast.warning('Confirmando pago...');
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

    useEffect(() => {
        console.log("Nuevo dataTravel:", dataTravel);
        if (dataTravel[0]?.id_viaje) {
            fetchData();
        }
    }, [dataTravel]);

    const [openOP, setOpenOP] = useState(false);

    const handleClickOpenEO = () => setOpenOP(true);
    const handleCloseEO = () => {
        setOpenOP(false);
        fetchData();
    };

    const columns = useMemo(() => [
        { accessorKey: 'name', header: 'Referencia' },
        { accessorKey: 'cartas_porte', header: 'Cartas porte' },
        { accessorKey: 'vehiculo', header: 'Vehiculo' },
        { accessorKey: 'operador', header: 'Operador' },
        { accessorKey: 'contenedores', header: 'Contenedores' },
    ], []);

    const columns2 = useMemo(
        () => [
            {
                accessorKey: 'llegada_planta',
                header: 'Llegada a planta',
            },
            {
                accessorKey: 'salida_planta',
                header: 'Salida de planta',
            },
            {
                accessorKey: 'horas_planta',
                header: 'Horas en planta',
            },
            {
                accessorKey: 'horas_estadias',
                header: 'Horas libres',
            },
            {
                accessorKey: 'horas_pagar',
                header: 'Horas a pagar',
                Cell: ({ cell }) => (
                    <TextField
                        type="number"
                        variant="standard"
                        value={cell.getValue() ?? ''}
                        onChange={(e) => setHorasPagar(Number(e.target.value))}
                    />
                ),
            },
            {
                accessorKey: 'total',
                header: 'Total',
                Cell: ({ cell }) => (
                    <TextField
                        type="number"
                        variant="standard"
                        value={cell.getValue() ?? ''}
                        onChange={(e) => setTotal(Number(e.target.value))}
                    />
                ),
            },
            {
                accessorKey: 'motivo',
                header: 'Motivo',
                Cell: ({ cell }) => (
                    <Select
                        variant="standard"
                        value={cell.getValue() ?? ''}
                        onChange={(e) => handleSelectionChange(e)}
                        displayEmpty
                    >
                        <MenuItem value="demora_descarga">Demora en descarga</MenuItem>
                        <MenuItem value="demora_carga">Demora en carga</MenuItem>
                    </Select>
                ),
            },
        ],
        [horas_pagar, total, motivo]
    );

    const dataTabla = [
        {
            llegada_planta: data?.llegada_planta,
            salida_planta: data?.salida_planta,
            horas_planta: data?.horas_planta,
            horas_estadias: data?.horas_estadias,
            horas_pagar: horas_pagar,
            total: total,
            motivo: motivo,
        },
    ];


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
            placeholder: `Buscar en ${dataTravel.length} viajes`,
            sx: { minWidth: '300px' },
            variant: 'outlined',
        },
        columnResizeMode: "onEnd",
        initialState: {
            showGlobalFilter: true,
            columnVisibility: { empresa: false },
            density: 'compact',
            expanded: true,
            showColumnFilters: true,
            pagination: { pageSize: 80 },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: { borderRadius: 0 },
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
        muiTableBodyRowProps: () => ({
            onClick: () => { },
        }),
        muiTableBodyCellProps: () => ({
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
            },
        }),
        renderTopToolbarCustomActions: () => (
            <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
                <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
                    Viaje estadía
                </h1>
                <Button onPress={handleClickOpenEO} color="primary">Añadir viaje</Button>
            </Box>
        ),
    });


    const table2 = useMaterialReactTable({
        columns: columns2,
        data: dataTabla,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        enableColumnPinning: true,
        enableStickyHeader: true,
        positionGlobalFilter: "right",
        localization: MRT_Localization_ES,
        columnResizeMode: "onEnd",
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            expanded: true,
            showColumnFilters: true,
            pagination: { pageSize: 80 },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: { borderRadius: 0 },
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
        muiTableBodyCellProps: () => ({
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
            },
        }),
        renderTopToolbarCustomActions: () => (
            <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
                <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
                    Viaje estadía
                </h1>
                <Button onPress={handleClickOpenEO} color="primary">Añadir viaje</Button>
            </Box>
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

                    <MaterialReactTable
                        table={table2}
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

                        </>)}

                </DialogContent>
            </Dialog >

            <ListViajes open={openOP} handleClose={handleCloseEO} setDataTravel={setDataTravel}></ListViajes>
        </>
    );
}

export default EstadiasOperadores;
