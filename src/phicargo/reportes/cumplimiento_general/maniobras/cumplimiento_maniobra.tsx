import React, { useEffect, useMemo, useState } from 'react';
import {
    MRT_Cell,
    MRT_Row,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import Box from '@mui/material/Box';
import { Button, Chip, RangeValue } from "@heroui/react"
import odooApi from '@/api/odoo-api';
import { DateRangePicker } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { exportToCSV } from '../../../utils/export';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { User } from "@heroui/react";
import Formulariomaniobra from '@/phicargo/maniobras/maniobras/form';
import { Progress } from '@heroui/react';
import { pages } from '../../../maniobras/pages';
import CustomNavbar from '@/pages/CustomNavbar';

type Maniobra = {
    id_maniobra: number;
    inicio_maniobra: string;
    fecha_inicio_maniobra: string;
    modulacion: string;
    fecha_modulacion: string;
    inicio_salida_terminal: string;
    fin_salida_terminal: string;
    ruta_fiscal: string;
    fecha_ruta_fiscal: string;
    llegada_terminal: string;
    fecha_llegada_terminal: string;
    fecha_salida_terminal: string;
    fin_maniobra: string;
    fecha_fin_maniobra: string;
    ultimo_estatus_enviado: string;
    fecha_ultimo_estatus: string;
    ultimo_estatus_usuario: string;
}

const ReporteCumplimientoManiobra = () => {

    const [modalShow, setModalShow] = React.useState(false);
    const [id_maniobra, setIdmaniobra] = useState<number | null>(null);
    const [dataCP, setDataCP] = useState({});

    const handleShowModal = (id_maniobra: number, data: any) => {
        setModalShow(true);
        setIdmaniobra(id_maniobra);
        setDataCP({ data });
    };

    const handleCloseModal = () => {
        setModalShow(false);
        fetchData();
    };

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const [dates, setDates] = useState<RangeValue<CalendarDate> | null>({
        start: parseDate(todayStr),
        end: parseDate(todayStr),
    });

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        if (!dates) return;

        const startDate = dates.start;
        const endDate = dates.end;
        try {
            setLoading(true);
            const response = await odooApi.get('/maniobras/reportes_estatus_maniobras/reporte_cumplimiento_estatus_general/', {
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
    }, [dates]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Maniobra',
            },
            {
                accessorKey: 'operador',
                header: 'Operador',
            },
            {
                accessorKey: 'estado_maniobra',
                header: 'Estado',
                Cell: ({ cell }: { cell: MRT_Cell<Maniobra> }) => {
                    const estatus_viaje = cell.getValue<string>();
                    return (
                        <Chip
                            size="sm"
                            color={estatus_viaje == "finalizada" ? "primary" : "success"}
                            className="text-white"
                        >
                            {estatus_viaje.charAt(0).toUpperCase() + estatus_viaje.slice(1)}
                        </Chip>
                    );
                },
            },
            {
                accessorKey: 'estatus_enviados',
                header: 'Estatus enviados',
            },
            {
                accessorKey: 'porcentaje_cumplimiento',
                header: 'Porcentaje cumplimiento',
                Cell: ({ cell }: { cell: MRT_Cell<Maniobra> }) => {
                    const porcentaje = cell.getValue<number>();

                    return (
                        <Progress
                            size="sm"
                            showValueLabel={true}
                            value={porcentaje}
                        >
                            {porcentaje}
                        </Progress>
                    );
                },
            },
            {
                accessorKey: 'ultimo_estatus_enviado',
                header: 'Ultimo estatus enviado',
                Cell: ({ row }: { row: MRT_Row<Maniobra> }) => {
                    const estatus = row.original.ultimo_estatus_enviado;
                    const nombre = row.original.fecha_ultimo_estatus;
                    const fecha = row.original.ultimo_estatus_usuario;

                    return (
                        <>
                            {nombre != null && (
                                <User
                                    avatarProps={{
                                        size: 'sm',
                                        color: 'secondary',
                                        isBordered: true,
                                    }}
                                    description={nombre + ' \n ' + fecha}
                                    name={estatus}></User>
                            )}
                        </>
                    );
                },
            },
            {
                accessorKey: 'inicio_maniobra',
                header: 'Inicio de maniobra',
                Cell: ({ row }: { row: MRT_Row<Maniobra> }) => {
                    const nombre = row.original.inicio_maniobra
                    const fecha = row.original.fecha_inicio_maniobra

                    return (
                        <>
                            {nombre != null && (
                                <User
                                    avatarProps={{
                                        color: 'primary',
                                        size: 'sm',
                                        isBordered: true,
                                    }}
                                    description={fecha}
                                    name={nombre}></User>
                            )}
                        </>
                    );
                },
            },
            {
                accessorKey: 'fecha_inicio_maniobra',
                header: 'Fecha inicio de maniobra',
            },
            {
                accessorKey: 'llegada_terminal',
                header: 'Llegada a terminal',
                Cell: ({ row }: { row: MRT_Row<Maniobra> }) => {
                    const nombre = row.original.llegada_terminal;
                    const fecha = row.original.fecha_llegada_terminal;

                    return (
                        <>
                            {nombre != null && (
                                <User
                                    avatarProps={{
                                        color: 'primary',
                                        size: 'sm',
                                        isBordered: true,
                                    }}
                                    description={fecha}
                                    name={nombre}></User>
                            )}
                        </>
                    );
                },
            },
            {
                accessorKey: 'fecha_llegada_terminal',
                header: 'Fecha llegada terminal',
            },
            {
                accessorKey: 'ruta_fiscal',
                header: 'Ruta fiscal',
                Cell: ({ row }: { row: MRT_Row<Maniobra> }) => {
                    const nombre = row.original.ruta_fiscal;
                    const fecha = row.original.fecha_ruta_fiscal;

                    return (
                        <>
                            {nombre != null && (
                                <User
                                    avatarProps={{
                                        size: 'sm',
                                        color: 'primary',
                                        isBordered: true,
                                    }}
                                    description={fecha}
                                    name={nombre}></User>
                            )}
                        </>
                    );
                },
            },
            {
                accessorKey: 'fecha_ruta_fiscal',
                header: 'Fecha ruta fiscal',
            },
            {
                accessorKey: 'modulacion',
                header: 'Modulación',
                Cell: ({ row }: { row: MRT_Row<Maniobra> }) => {
                    const nombre = row.original.modulacion;
                    const fecha = row.original.fecha_modulacion;

                    return (
                        <>
                            {nombre != null && (
                                <User
                                    avatarProps={{
                                        size: 'sm',
                                        color: 'primary',
                                        isBordered: true,
                                    }}
                                    description={fecha}
                                    name={nombre}></User>
                            )}
                        </>
                    );
                },
            },
            {
                accessorKey: 'fecha_modulacion',
                header: 'Fecha modulacion',
            },
            {
                accessorKey: 'salida_terminal',
                header: 'Salida_terminal',
                Cell: ({ row }: { row: MRT_Row<Maniobra> }) => {
                    const nombre = row.original.inicio_salida_terminal;
                    const fecha = row.original.fecha_salida_terminal;

                    return (
                        <>
                            {nombre != null && (
                                <User
                                    avatarProps={{
                                        size: 'sm',
                                        color: 'primary',
                                        isBordered: true,
                                    }}
                                    description={fecha}
                                    name={nombre}></User>
                            )}
                        </>
                    );
                },
            },
            {
                accessorKey: 'fecha_salida_terminal',
                header: 'Fecha salida_terminal',
            },
            {
                accessorKey: 'fin_maniobra',
                header: 'Fin maniobra',
                Cell: ({ row }: { row: MRT_Row<Maniobra> }) => {
                    const nombre = row.original.fin_maniobra;
                    const fecha = row.original.fecha_fin_maniobra;

                    return (
                        <>
                            {nombre != null && (
                                <User
                                    avatarProps={{
                                        color: 'primary',
                                        size: 'sm',
                                        isBordered: true,
                                    }}
                                    description={fecha}
                                    name={nombre}></User>
                            )}
                        </>
                    );
                },
            },
            {
                accessorKey: 'fecha_fin_maniobra',
                header: 'Fecha fin_maniobra',
            },
        ], []
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
            columnPinning: { left: ['id_maniobra', 'estado_maniobra', 'nombre', 'contenedores', 'tipo_maniobra'] },
            showColumnFilters: true,
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                handleShowModal(row.original.id_maniobra, row.original);
            },
            style: {
                cursor: 'pointer',
            },
        }),
        muiTableHeadCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'Bold',
                fontSize: '12px',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '12px',
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
                    Cumplimiento de estatus en maniobra
                </h1>

                <DateRangePicker
                    label="Fecha"
                    value={dates}
                    variant='bordered'
                    onChange={setDates} />
                <Button color='success' className='text-white' startContent={<i className="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "reporte_estatus.csv")} fullWidth>Exportar</Button>
                <Button color='primary' className='text-white' startContent={<i className="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()} fullWidth>Recargar</Button>
            </Box>
        ),
    });

    return (
        <>
            <CustomNavbar pages={pages}></CustomNavbar>
            <MaterialReactTable table={table} />
            <Formulariomaniobra
                show={modalShow}
                handleClose={handleCloseModal}
                id_maniobra={id_maniobra}
                dataCP={dataCP}
            />
        </>
    );
};

export default ReporteCumplimientoManiobra;
