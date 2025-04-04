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

    const [columnOrder, setColumnOrder] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [dates, setDates] = useState([]);
    const [value, setValue] = React.useState([0, 24]);


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
                const response = await odooApi.get('/tms_travel/reporte_cumplimiento_estatus_ejecutivos/', {
                    params: {
                        hora_inicio: value[0],
                        hora_fin: value[1],
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
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(dates), JSON.stringify(value)]);

    useEffect(() => {
        if (data.length > 0) {
            const orderedKeys = Object.keys(data[0]);
            setColumnOrder(orderedKeys);
        }
    }, [data, value]);

    const columns = useMemo(() => {
        if (!data || data.length === 0 || columnOrder.length === 0) return [];

        return columnOrder
            .filter((key) => !key.includes('20_min'))
            .map((key) => ({
                accessorKey: key,
                header: key.replace(/_/g, " ").toUpperCase(),
                size: 150
            }));
    }, [data, columnOrder, value]);

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
                maxHeight: 'calc(100vh - 300px)',
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

                <h1
                    className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
                >
                    Cumplimiento de estatus
                </h1>

                <RangePicker onChange={handleDateChange} />

                <Slider
                    className="max-w-md"
                    value={value}
                    onChange={setValue}
                    label="Hora"
                    maxValue={24}
                    minValue={0}
                    step={1}
                />

                <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "viajes_activos.csv")}>Exportar</Button>

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
