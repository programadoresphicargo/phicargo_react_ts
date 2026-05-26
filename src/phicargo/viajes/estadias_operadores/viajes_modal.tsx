import React, { useEffect, useMemo, useState } from 'react';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Box } from '@mui/material';
import { DateRangePicker, RangeValue } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { Folio } from './folios/folios';
import { UseFormSetValue } from 'react-hook-form';

type Viaje = { id_viaje: number }

function ListViajes({ open, handleClose, setDataViaje }: { open: boolean, handleClose: () => void, setDataViaje: UseFormSetValue<Folio> }) {

    function formatDateToYYYYMMDD(date: Date) {
        return date.toISOString().slice(0, 10);
    }

    const now = new Date();
    const first = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth(), 1));
    const last = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth() + 1, 0));

    const [value, setValue] = React.useState<RangeValue<CalendarDate> | null>({
        start: parseDate(first),
        end: parseDate(last)
    });

    const [data, setData] = useState<Viaje[]>([]);
    const [isLoading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/completed_travels/', {
                params: {
                    date_start: value?.start,
                    date_end: value?.end
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
            },
            {
                accessorKey: 'fecha_finalizado',
                header: 'Fecha finalización',
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
            pagination: { pageIndex: 0, pageSize: 80 },
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
                maxHeight: 'calc(100vh - 310px)',
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                console.log(row.original);
                setDataViaje("id_viaje", row.original.id_viaje);
                handleClose();
            },
        }),
        muiTableBodyCellProps: () => ({
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '12px',
            },
        }),
        renderTopToolbarCustomActions: () => (
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
                    value={value}
                    onChange={setValue}
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
