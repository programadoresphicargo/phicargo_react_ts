import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import { Button, Chip } from "@heroui/react"
import { DatePicker } from 'antd';
import odooApi from '@/api/odoo-api';
import NavbarViajes from '@/phicargo/viajes/navbar';
import { ViajeProvider } from '@/phicargo/viajes/context/viajeContext';
import { Slider } from "@heroui/react";
import { DateRangePicker } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { exportToCSV } from '../../utils/export';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { User } from "@heroui/react";
const { VITE_PHIDES_API_URL } = import.meta.env;

const { RangePicker } = DatePicker;

const ReporteCumplimientoEjecutivo = () => {

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
    };

    useEffect(() => {
        fetchData();
    }, [dates, value]);

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
            .filter((key) => !key.includes('fecha_envio'))
            .filter((key) => !key.includes('imagen'))
            .map((key) => {
                const isHora = /^\d{1,2}:\d{2}$/.test(key);

                return {
                    accessorKey: key,
                    header: key.replace(/_/g, " ").toUpperCase(),
                    size: 150,
                    Cell: ({ cell, row }) => {
                        const value = cell.getValue();
                        const fechaEnvio = row.original?.[`${key}_fecha_envio`];
                        const min20 = row.original?.[`${key}_first_20_min`];
                        const imagen = row.original?.[`${key}_imagen`];

                        if (isHora && value) {
                            return (
                                <User
                                    avatarProps={{
                                        color: min20 == null ? 'danger' : 'primary',
                                        isBordered: true,
                                        size: 'sm',
                                        src: VITE_PHIDES_API_URL + `/img/status/${imagen}`,
                                    }}
                                    description={fechaEnvio}
                                    name={value}
                                />
                            );
                        }

                        return value ?? "";
                    },
                };
            });
    }, [data, columnOrder, value]);

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        localization: MRT_Localization_ES,
        state: { showProgressBars: isLoading },
        initialState: {
            showColumnFilters: true,
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
                maxHeight: 'calc(100vh - 230px)',
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
                    className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
                >
                    Cumplimiento de estatus
                </h1>

                <DateRangePicker
                    className="max-w-xs"
                    label="Fecha"
                    value={dates}
                    variant='bordered'
                    onChange={setDates} />

                <Slider
                    className="max-w-xs"
                    value={value}
                    onChange={setValue}
                    label="Hora"
                    maxValue={24}
                    minValue={0}
                    step={1}
                />

                <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "reporte_estatus.csv")}>Exportar</Button>

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
