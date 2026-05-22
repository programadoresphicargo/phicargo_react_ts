import React, { useEffect, useMemo, useState } from 'react';
import {
    MRT_Cell,
    MRT_ColumnDef,
    MRT_Row,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import Box from '@mui/material/Box';
import { Button, Chip } from "@heroui/react"
import odooApi from '@/api/odoo-api';
import { Slider } from "@heroui/react";
import { DateRangePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { exportToCSV } from '../../utils/export';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { User } from "@heroui/react";
import Travel from '@/phicargo/viajes/control/viaje';
import NavbarTravel from '@/phicargo/viajes/navbar_viajes';
const { VITE_ODOO_API_URL } = import.meta.env;

interface ReporteRow {
    id_viaje: number | null;
    estatus?: string;
    referencia?: string;
    sucursal?: string;
    nombre?: string;

    [key: string]: any;
}

const ReporteCumplimientoEjecutivo = () => {

    const [open, setOpen] = React.useState(false);
    const [idViaje, setIDViaje] = React.useState<number | null>(null);

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

    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [value, setValue] = React.useState<[number, number]>([0, 24]);
    const [data, setData] = useState<ReporteRow[]>([]);

    const fetchData = async () => {
        const startDate = dates.start;
        const endDate = dates.end;
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/reportes_estatus_viajes/reporte_cumplimiento_estatus_ejecutivos/', {
                params: {
                    hora_inicio: value[0],
                    hora_fin: value[1],
                    fecha_inicio: startDate.toString(),
                    fecha_fin: endDate.toString(),
                },
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        } finally {
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

    const columns = useMemo<MRT_ColumnDef<ReporteRow>[]>(() => {
        if (!data || data.length === 0 || columnOrder.length === 0) return [];

        return columnOrder
            .filter((key) => !key.includes('20_min'))
            .filter((key) => !key.includes('fecha_envio'))
            .filter((key) => !key.includes('imagen'))
            .filter((key) => !key.includes('id_viaje'))
            .map((key) => {
                const isHora = /^\d{4}-\d{2}-\d{2}_\d{2}:\d{2}$/.test(key);

                return {
                    accessorKey: key,
                    header: key.replace(/_/g, " ").toUpperCase(),
                    enableColumnPinning: true,
                    size: 150,
                    Cell: ({
                        cell,
                        row,
                    }: {
                        cell: MRT_Cell<ReporteRow>;
                        row: MRT_Row<ReporteRow>;
                    }) => {
                        const value = cell.getValue<string>();
                        const fechaEnvio = row.original?.[`${key}_fecha_envio`];
                        const min20 = row.original?.[`${key}_first_20_min`];
                        const imagen = row.original?.[`${key}_imagen`];

                        if (key === 'estatus') {
                            return (
                                <Chip
                                    className='text-white'
                                    color={
                                        value === 'ruta' ? 'primary'
                                            : value === 'planta' ? 'success'
                                                : value === 'retorno' ? 'warning'
                                                    : value === 'finalizado' ? 'secondary'
                                                        : 'default'
                                    }
                                    variant="solid"
                                >
                                    {value}
                                </Chip>
                            );
                        }

                        if (isHora && value != null) {
                            return (
                                <User
                                    avatarProps={{
                                        color: min20 == null ? 'danger' : 'primary',
                                        isBordered: true,
                                        size: 'sm',
                                        src: VITE_ODOO_API_URL + `/assets/trafico/estatus_operativos/${imagen}`,
                                    }}
                                    description={fechaEnvio}
                                    name={value}
                                />
                            );
                        }

                        return String(value ?? "").toUpperCase();
                    }
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
        enableColumnPinning: true,
        enableStickyHeader: true,
        state: { showProgressBars: isLoading },
        initialState: {
            columnPinning: { left: ['referencia', 'sucursal', 'estatus', 'nombre'] },
            showColumnFilters: true,
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                handleClickOpen();
                setIDViaje(row.original.id_viaje);
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
        renderTopToolbarCustomActions: () => (
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
                    Cumplimiento de estatus en viajes
                </h1>

                <DateRangePicker
                    label="Fecha"
                    value={dates}
                    variant='bordered'
                    onChange={(value) => {
                        if (value) {
                            setDates(value);
                        }
                    }} />

                <Slider
                    className="flex-1 min-w-[300px]"
                    value={value}
                    onChange={(val) => {
                        if (
                            Array.isArray(val) &&
                            val.length === 2
                        ) {
                            setValue([val[0], val[1]]);
                        }
                    }}
                    label="Hora"
                    maxValue={24}
                    minValue={0}
                    step={1}
                />

                <Button color='success' className='text-white' startContent={<i className="bi bi-file-earmark-excel"></i>} radius='full' onPress={() => exportToCSV(data, columns, "reporte_estatus.csv")} fullWidth>Exportar</Button>
                <Button color='primary' className='text-white' startContent={<i className="bi bi-arrow-clockwise"></i>} radius='full' onPress={() => fetchData()} fullWidth>Recargar</Button>

            </Box>

        ),
    });

    return (
        <>
            <NavbarTravel></NavbarTravel>
            <MaterialReactTable table={table} />
            {idViaje && (
                <Travel idViaje={idViaje} open={open} handleClose={handleClose}></Travel>
            )}
        </>
    );
};

export default ReporteCumplimientoEjecutivo;
