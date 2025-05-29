import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Popover, PopoverContent, PopoverTrigger, User, useDisclosure } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Avatar } from "@heroui/react";
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import DetencionesViajesActivos from '../../detenciones/detenciones_modal';
import Dialog from '@mui/material/Dialog';
import EstatusDropdown from '../../estatus/resumen_estatus';
import IconButton from '@mui/material/IconButton';
import { Image } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import NavbarViajes from '../../navbar';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { exportToCSV } from '../../../utils/export';
import odooApi from '@/api/odoo-api';
import { ViajeProvider } from '../../context/viajeContext';
import EstadiasOperadores from '../folios';
import AbrirPeriodo from './modal_periodo';
import PagosPeriodo from './folios_pago';
import { Link } from '@heroui/react';
const apiUrl = import.meta.env.VITE_ODOO_API_URL;

const PagosEstadiasOperadores = ({ }) => {

    const [folio, setFolio] = React.useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const [id_usuario, setIDUsuario] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/periodos_pagos_estadias_operadores/');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [openOP, setOpenOP] = React.useState(false);

    const handleClickOpenEO = () => {
        setOpenOP(true);
    };

    const handleCloseEO = () => {
        setOpenOP(false);
        fetchData();
        setFolio(null);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'date_start',
                header: 'Fecha inicio',
            },
            {
                accessorKey: 'date_end',
                header: 'Fecha fin',
            },
            {
                accessorKey: 'usuario',
                header: 'Nombre',
            },
            {
                accessorKey: 'fecha_creacion',
                header: 'Fecha creacion',
            },
            {
                header: "Acciones",
                Cell: ({ row }) => {
                    const id = row.original.id; // asegúrate que esta clave esté disponible
                    return (
                        <Button
                            showAnchorIcon
                            as={Link}
                            isExternal={true}
                            className="text-white"
                            color="warning"
                            href={`${apiUrl}/tms_travel/periodos_pagos_estadias_operadores/comprobante/` + id}
                            variant="solid"
                        >
                            PDF
                        </Button>
                    );
                },
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
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
            hiddenColumns: ["empresa"],
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

        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                handleClickOpen();
                setIDUsuario(row.original.id_usuario);
                setStartDate(row.original.date_start);
                setEndDate(row.original.date_end);
            },
        }),
        muiTableBodyCellProps: ({ row }) => ({
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '12px',
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
                    Periodos de pagos estadías operadores
                </h1>
                <Button
                    className='text-white'
                    startContent={<i class="bi bi-plus-lg"></i>}
                    color='success'
                    isDisabled={false}
                    onPress={() => {
                        handleClickOpenEO();
                    }}
                    size='sm'
                >Nuevo registro
                </Button>
                <Button
                    className='text-white'
                    startContent={<i class="bi bi-arrow-clockwise"></i>}
                    color='primary'
                    isDisabled={false}
                    onPress={() => fetchData()}
                    size='sm'
                >Actualizar tablero
                </Button>
                <Button color='success'
                    className='text-white'
                    startContent={<i class="bi bi-file-earmark-excel"></i>}
                    onPress={() => exportToCSV(data, columns, "viajes_activos.csv")}
                    size='sm'>
                    Exportar
                </Button>
            </Box >
        ),
    });

    return (
        <>
            <ViajeProvider>
                <NavbarViajes></NavbarViajes>
                <MaterialReactTable
                    table={table}
                />

                <AbrirPeriodo open={openOP} handleClose={handleCloseEO} datapago={folio}></AbrirPeriodo>
                <PagosPeriodo open={open} handleClose={handleClose} id_usuario={id_usuario} startDate={startDate} endDate={endDate}></PagosPeriodo>

            </ViajeProvider>
        </>
    );
};

export default PagosEstadiasOperadores;
