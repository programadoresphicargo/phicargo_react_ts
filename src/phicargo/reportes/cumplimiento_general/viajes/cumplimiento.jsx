import React, { useEffect, useMemo, useState, useContext } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import Box from '@mui/material/Box';
import { Button, Chip } from "@heroui/react"
import { DatePicker } from 'antd';
import odooApi from '@/api/odoo-api';
import NavbarViajes from '@/phicargo/viajes/navbar';
import { Slider } from "@heroui/react";
import { DateRangePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { exportToCSV } from '../../../utils/export';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { User } from "@heroui/react";
import Travel from '@/phicargo/viajes/control/viaje';
import { ViajeContext } from '@/phicargo/viajes/context/viajeContext';
import ReporteCumplimientoGeneralViajeIndex from './index_cumplimiento';
const { VITE_ODOO_API_URL } = import.meta.env;

const ReporteCumplimientoV = () => {

    const { id_viaje, viaje, getViaje, loading, error, ActualizarIDViaje } = useContext(ViajeContext);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        getViaje(id_viaje);
    }, [id_viaje]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const [dates, setDates] = React.useState({
        start: parseDate(todayStr),
        end: parseDate(todayStr),
    });

    const [columnOrder, setColumnOrder] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [value, setValue] = React.useState([0, 24]);


    const handleDateChange = (dates) => {
        setDates(dates);
    };

    const [data, setData] = useState([]);

    const fetchData = async () => {
        const startDate = dates.start;
        const endDate = dates.end;
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/reportes_estatus_viajes/reporte_cumplimiento_estatus_viajes/', {
                params: {
                    fecha_inicio: startDate,
                    fecha_fin: endDate,
                },
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dates, value]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id_viaje',
                header: 'Viaje',
            },
            {
                accessorKey: 'inicio_viaje',
                header: 'Inicio de viaje',
            },
            {
                accessorKey: 'llegada_planta',
                header: 'Llegada a planta',
            },
            {
                accessorKey: 'ingreso_planta',
                header: 'Ingreso a planta',
            },
            {
                accessorKey: 'asignacion_rampa',
                header: 'Asignación de rampa',
            },
            {
                accessorKey: 'inicio_carga_descarga',
                header: 'Inicio de carga o descarga',
            },
            {
                accessorKey: 'fin_carga_descarga',
                header: 'Fin de carga o descarga',
            },
            {
                accessorKey: 'salida_planta',
                header: 'Salida de planta',
            },
            {
                accessorKey: 'estatus_enviados',
                header: 'Estatus enviados',
            },
            {
                accessorKey: 'porcentaje_cumplimiento',
                header: 'Porcentaje cumplimiento',
            },
        ]
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        localization: MRT_Localization_ES,
        enableColumnPinning: true,
        enableStickyHeader: true,
        state: { showProgressBars: isLoading },
        initialState: {
            columnPinning: { left: ['referencia', 'sucursal', 'estatus', 'nombre'] },
            showColumnFilters: true,
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
                handleClickOpen();
                ActualizarIDViaje(row.original.id_viaje);
            },
            style: {
                cursor: 'pointer',
            },
        }),
        muiTableHeadCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'Bold',
                fontSize: '14px',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '14px',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 235px)',
            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    overflowX: 'auto',
                }}
            >

                <h1
                    className="flex-1 min-w-[300px] tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
                >
                    Cumplimiento de envío de estatus
                </h1>

                <DateRangePicker
                    label="Fecha"
                    value={dates}
                    variant='bordered'
                    onChange={setDates} />

                <Slider
                    className="flex-1 min-w-[300px]"
                    fullWidth
                    value={value}
                    onChange={setValue}
                    label="Hora"
                    maxValue={24}
                    minValue={0}
                    step={1}
                />

                <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "reporte_estatus.csv")} fullWidth>Exportar</Button>
                <Button color='primary' className='text-white' startContent={<i class="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()} fullWidth>Recargar</Button>

            </Box>

        ),
    });

    return (
        <>
            <NavbarViajes></NavbarViajes>
            <MaterialReactTable table={table} />
            <Travel open={open} handleClose={handleClose}></Travel>
        </>
    );
};

export default ReporteCumplimientoV;
