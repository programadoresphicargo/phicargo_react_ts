import { Avatar, Badge, Card, CardHeader } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Spinner } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@heroui/react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Box } from '@mui/material';
import { DateRangePicker } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

function ListViajes({ open, handleClose, setDataTravel }) {
    function formatDateToYYYYMMDD(date) {
        return date.toISOString().slice(0, 10);
    }

    const now = new Date();
    const first = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth(), 1));
    const last = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth() + 1, 0));

    const [value, setValue] = React.useState({
        start: parseDate(first),
        end: parseDate(last)
    });

    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/completed_travels/', {
                params: {
                    date_start: value.start,
                    date_end: value.end
                }
            });
            setData(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            toast.error('Error al obtener los viajes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [open, value]);

    const formatFecha = (fechaISO) => {
        if (!fechaISO) return "";
        return new Date(fechaISO).toLocaleString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'sucursal',
                header: 'Sucursal',
            },
            {
                accessorKey: 'name',
                header: 'Referencia',
            },
            {
                accessorKey: 'cartas_porte',
                header: 'Cartas porte',
            },
            {
                accessorKey: 'fecha_inicio',
                header: 'Fecha de inicio',
                Cell: ({ cell }) => formatFecha(cell.getValue()),
            },
            {
                accessorKey: 'fecha_finalizado',
                header: 'Fecha finalización',
                Cell: ({ cell }) => formatFecha(cell.getValue()),
            },
            {
                accessorKey: 'vehiculo',
                header: 'Vehiculo',
            },
            {
                accessorKey: 'operador',
                header: 'Operador',
            },
            {
                accessorKey: 'contenedores',
                header: 'Contenedores',
            },
            {
                accessorKey: 'tipo_armado',
                header: 'Armado',
            },
            {
                accessorKey: 'tipo',
                header: 'Modalidad',
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
                console.log(row.original);
                setDataTravel([row.original]);
                handleClose();
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
                    Viajes finalizados
                </h1>

                <DateRangePicker
                    visibleMonths={2}
                    value={value} onChange={setValue}
                    className="max-w-xs"
                    label="Viajes finalizadoss"
                />

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
                <DialogContent>
                    <MaterialReactTable
                        table={table}
                    />
                </DialogContent>
            </Dialog >
        </>
    );
}

export default ListViajes;
