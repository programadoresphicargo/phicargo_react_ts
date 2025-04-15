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
import { exportToCSV } from '../../utils/export';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { User } from "@heroui/react";
import Travel from '@/phicargo/viajes/control/viaje';
import ManiobrasNavBar from '@/phicargo/maniobras/Navbar';
import Formulariomaniobra from '@/phicargo/maniobras/maniobras/formulario_maniobra';
const { VITE_PHIDES_API_URL } = import.meta.env;

const ReporteCumplimientoEjecutivoManiobra = () => {

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
            const response = await odooApi.get('/reportes_estatus_maniobras/reporte_cumplimiento_estatus_ejecutivos/', {
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
            .filter((key) => !key.includes('fecha_hora'))
            .filter((key) => !key.includes('imagen'))
            .filter((key) => !key.includes('id'))
            .filter((key) => !key.includes('id_cliente'))
            .map((key) => {
                const isHora = /^\d{4}-\d{2}-\d{2}_\d{2}:\d{2}$/.test(key);

                return {
                    accessorKey: key,
                    header: key.replace(/_/g, " ").toUpperCase(),
                    enableColumnPinning: true,
                    size: 150,
                    Cell: ({ cell, row }) => {
                        const value = cell.getValue();
                        const fechaEnvio = row.original?.[`${key}_fecha_hora`];
                        const min20 = row.original?.[`${key}_first_20_min`];
                        const imagen = row.original?.[`${key}_imagen`];

                        if (key === 'estado_maniobra') {
                            return (
                                <Chip
                                    className='text-white'
                                    color={
                                        value === 'activa' ? 'success'
                                            : value === 'finalizada' ? 'secondary'
                                                : 'default'
                                    }
                                    variant="solid"
                                    size='sm'
                                >
                                    {value}
                                </Chip>
                            );
                        }

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
            <ManiobrasNavBar></ManiobrasNavBar>
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

export default ReporteCumplimientoEjecutivoManiobra;
