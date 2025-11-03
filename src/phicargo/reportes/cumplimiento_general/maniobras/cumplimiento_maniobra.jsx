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
import Formulariomaniobra from '@/phicargo/maniobras/maniobras/formulario_maniobra';
import { Progress } from '@heroui/react';
import { pages } from '../../../maniobras/pages';
import CustomNavbar from '@/pages/CustomNavbar';

const { VITE_ODOO_API_URL } = import.meta.env;

const ReporteCumplimientoManiobra = () => {

    const [modalShow, setModalShow] = React.useState(false);

    const [id_maniobra, setIdmaniobra] = useState('');
    const [id_cp, setIdcp] = useState('');
    const [idCliente, setClienteID] = useState('');

    const handleShowModal = (id_maniobra, id_cp) => {
        setModalShow(true);
        setIdmaniobra(id_maniobra);
        setIdcp(id_cp);
    };

    const handleCloseModal = () => {
        setModalShow(false);
        fetchData();
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
    }, [dates, value]);

    useEffect(() => {
        if (data.length > 0) {
            const orderedKeys = Object.keys(data[0]);
            setColumnOrder(orderedKeys);
        }
    }, [data, value]);

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
                Cell: ({ cell }) => {
                    const estatus_viaje = cell.getValue();
                    let badgeClass = '';

                    if (estatus_viaje === 'finalizada') {
                        badgeClass = 'primary';
                    } else if (estatus_viaje === 'activa') {
                        badgeClass = 'success';
                    }

                    return (
                        <Chip
                            size="sm"
                            color={badgeClass}
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
                Cell: ({ cell }) => {
                    const porcentaje = cell.getValue();

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
                Cell: ({ row }) => {
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
                Cell: ({ row }) => {
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
                Cell: ({ row }) => {
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
                Cell: ({ row }) => {
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
                Cell: ({ row }) => {
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
                Cell: ({ row }) => {
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
                Cell: ({ row }) => {
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
            columnPinning: { left: ['id_maniobra', 'estado_maniobra', 'nombre', 'contenedores', 'tipo_maniobra'] },
            showColumnFilters: true,
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
                handleShowModal(row.original.id_maniobra, row.original.id);
                setClienteID(row.original.id_cliente);
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
                    Cumplimiento de estatus en maniobra
                </h1>

                <DateRangePicker
                    label="Fecha"
                    value={dates}
                    variant='bordered'
                    onChange={setDates} />

                <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "reporte_estatus.csv")} fullWidth>Exportar</Button>
                <Button color='primary' className='text-white' startContent={<i class="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()} fullWidth>Recargar</Button>

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
                id_cp={id_cp}
                id_cliente={idCliente}
                form_deshabilitado={true}
            />
        </>
    );
};

export default ReporteCumplimientoManiobra;
