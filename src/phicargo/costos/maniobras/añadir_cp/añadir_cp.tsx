import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button, RangeValue } from "@heroui/react";
import { CartaPorte, useCostosExtras } from '../../context/context';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import odooApi from '@/api/odoo-api';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { DateRangePicker } from "@heroui/react";
import { DateValue, parseDate } from "@internationalized/date";

const AñadirContenedor = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {

    const { setCPS } = useCostosExtras();
    const [data, setData] = useState([]);
    const [isLoading, setILoading] = useState(false);

    function formatDateToYYYYMMDD(date: Date): string {
        return date.toISOString().slice(0, 10);
    }

    const now = new Date();
    const first = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth(), 1));
    const last = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth() + 1, 0));

    const [value, setValue] = React.useState<RangeValue<DateValue> | null>({
        start: parseDate(first),
        end: parseDate(last)
    });

    useEffect(() => {
        if (!value) return;
        const fetchData = async () => {
            try {
                setILoading(true);
                const response = await odooApi.get('/tms_waybill/get_waybills/', {
                    params: {
                        date_start: value.start,
                        date_end: value.end
                    }
                });
                setData(response.data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setILoading(false);
            }
        };

        fetchData();
    }, [value]);

    const añadir_contenedor = (data: CartaPorte) => {
        setCPS(prevCartasPorte => [...prevCartasPorte, data]);
        handleClose();
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Carta porte',
            },
            {
                accessorKey: 'x_ejecutivo_viaje_bel',
                header: 'Ejecutivo de viaje',
            },
            {
                accessorKey: 'x_reference',
                header: 'Contenedor',
            },
            {
                accessorKey: 'date_order',
                header: 'Fecha',
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: false,
        enableFilters: true,
        localization: MRT_Localization_ES,
        state: {
            showColumnFilters: true,
            showProgressBars: isLoading
        },
        muiCircularProgressProps: {
            color: 'primary',
            thickness: 5,
            size: 45,
        },
        muiSkeletonProps: {
            animation: 'pulse',
            height: 28,
        },
        initialState: {
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
        },
        enableRowActions: true,
        displayColumnDefOptions: {
            'mrt-row-actions': {
                header: 'Seleccionar',
                size: 100,
            },
        },
        renderRowActions: ({ row }) => (
            <Box>
                <Button color='primary' onPress={() => añadir_contenedor(row.original)} size='sm' radius='full'>
                    Añadir
                </Button>
            </Box>
        ),
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 385px)',
                boxShadow: 'none',
            },
        },
        muiTableHeadCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'Bold',
                fontSize: '14px',
            },
        },
        muiTableBodyCellProps: ({ row }) => ({
            sx: {
                backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '14px',
                color: row.subRows?.length ? '#FFFFFF' : '#000000',
                borderBottom: '1px solid #e0e0e0'
            },
        }),
        renderTopToolbarCustomActions: () => (
            <Box display="flex" alignItems="center" m={2}>
                <DateRangePicker
                    visibleMonths={2}
                    value={value}
                    onChange={setValue}
                    className="max-w-xs"
                    label="Cartas porte"
                />
            </Box>
        ),
    });

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth='xl'
            >
                <DialogTitle id="example-custom-modal-styling-title">
                    Cartas porte
                </DialogTitle>
                <DialogContent>
                    <MaterialReactTable table={table} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AñadirContenedor;