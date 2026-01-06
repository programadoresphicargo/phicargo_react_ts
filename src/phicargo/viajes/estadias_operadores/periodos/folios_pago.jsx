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
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { exportToCSV } from '../../../utils/export';
import odooApi from '@/api/odoo-api';
import EstadiasOperadores from '../folios';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const PagosPeriodo = ({ open, handleClose, id_usuario, startDate, endDate }) => {

    const [folio, setFolio] = React.useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/pagos_estadias_operadores/date_range/', {
                params: {
                    id_usuario: id_usuario,
                    date_start: startDate,
                    date_end: endDate
                }
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [open]);

    const [openOP, setOpenOP] = React.useState(false);

    const handleClickOpenEO = () => {
        setOpenOP(true);
    };

    const handleCloseEO = () => {
        setOpenOP(false);
        fetchData();
        setFolio(null);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id_pago',
                header: 'Folio',
            },
            {
                accessorKey: 'travel_name',
                header: 'Viaje',
            },
            {
                accessorKey: 'cartas_porte',
                header: 'Cartas porte',
            },
            {
                accessorKey: 'cliente',
                header: 'Cliente',
            },
            {
                accessorKey: 'employee_name',
                header: 'Operador',
            },
            {
                accessorKey: 'llegada_planta',
                header: 'Llegada planta',
            },
            {
                accessorKey: 'salida_planta',
                header: 'Salida planta',
            },
            {
                accessorKey: 'horas_planta',
                header: 'Horas en planta',
            },
            {
                accessorKey: 'x_horas_estadias',
                header: 'Horas libres',
            },
            {
                accessorKey: 'horas_pagar',
                header: 'Horas a pagar',
            },
            {
                accessorKey: 'total',
                header: 'Total',
            },
            {
                accessorKey: 'motivo',
                header: 'Motivo',
            },
            {
                accessorKey: 'usuario_creacion',
                header: 'Usuario',
            },
            {
                accessorKey: 'fecha_creacion',
                header: 'Fecha creación',
            },
            {
                accessorKey: 'estado',
                header: 'Estado',
                Cell: ({ cell }) => {
                    const estado = cell.getValue() || '';
                    let badgeClass = 'default';

                    if (estado === 'confirmado') {
                        badgeClass = 'success';
                    } else if (estado === 'borrador') {
                        badgeClass = 'warning';
                    } else if (estado === 'cancelado') {
                        badgeClass = 'danger';
                    } else if (estado === 'pagado') {
                        badgeClass = 'primary';
                    }

                    return (
                        <Chip color={badgeClass} className="text-white" size="sm">
                            {estado}
                        </Chip>
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
                handleClickOpenEO();
                setFolio(row.original);
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
                    Pagos estadías operadores
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
                </DialogTitle>
                <DialogContent>
                    <MaterialReactTable
                        table={table}
                    />
                </DialogContent>
            </Dialog >

            <EstadiasOperadores open={openOP} handleClose={handleCloseEO} datapago={folio}></EstadiasOperadores>
        </>
    );
};

export default PagosPeriodo;
