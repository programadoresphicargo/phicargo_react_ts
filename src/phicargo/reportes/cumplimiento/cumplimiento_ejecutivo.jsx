import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react"
import { DatePicker } from 'antd';
import odooApi from '@/api/odoo-api';
import NavbarViajes from '@/phicargo/viajes/navbar';
import { ViajeProvider } from '@/phicargo/viajes/context/viajeContext';
import { Slider } from "@heroui/react";

const { RangePicker } = DatePicker;

const ReporteCumplimientoEjecutivo = () => {

    const [isLoading, setLoading] = useState(false);

    const [dates, setDates] = useState([]);

    const handleDateChange = (dates) => {
        setDates(dates);
    };

    const [data, setData] = useState([]);

    const fetchData = async () => {
        if (dates && dates.length === 2 && dates[0] && dates[1]) {
            const startDate = dates[0].format('YYYY-MM-DD');
            const endDate = dates[1].format('YYYY-MM-DD');
            try {
                setLoading(true);
                const response = await odooApi.get('/tms_travel/reporte_cumplimiento_estatus_ejecutivos/?hora_inicio=7&hora_fin=24&fecha_inicio=2025-04-01&fecha_fin=2025-04-30');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [dates]);

    const columns = useMemo(() => {
        if (!data || data.length === 0) return [];

        return Object.keys(data[0])
            .filter((key) => !key.includes('20_min'))
            .map((key) => ({
                accessorKey: key,
                header: key.replace(/_/g, " ").toUpperCase(),
                size: 150
            }));
    }, [data]);

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        state: { showProgressBars: isLoading },
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => { },
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
                maxHeight: 'calc(100vh - 260px)',
            },
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <RangePicker onChange={handleDateChange} />

                <Slider
                    className="max-w-md"
                    defaultValue={[9, 18]}
                    label="Hora"
                    maxValue={24}
                    minValue={0}
                    step={1}
                />
            </Box>
        ),
    });

    return (
        <div>
            <ViajeProvider>
                <NavbarViajes></NavbarViajes>
                <MaterialReactTable table={table} />
            </ViajeProvider>
        </div>
    );
};

export default ReporteCumplimientoEjecutivo;
