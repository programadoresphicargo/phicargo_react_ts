import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import { CostosExtrasContext } from '../../context/context';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { DateRangePicker } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

const AñadirContenedor = ({ show, handleClose }) => {

    const { id_folio, CartasPorte, setCPS } = useContext(CostosExtrasContext);
    const [data, setData] = useState([]);
    const [isLoading2, setILoading] = useState();

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

    useEffect(() => {
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

    const añadir_contenedor = (data) => {
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
                size: 150,
            },
            {
                accessorKey: 'x_reference',
                header: 'Contenedor',
                size: 150,
            }, {
                accessorKey: 'date_order',
                header: 'Fecha',
                size: 150,
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        elevation: 0,
        enableGrouping: true,
        enableGlobalFilter: false,
        enableFilters: true,
        localization: MRT_Localization_ES,
        state: {
            isLoading: isLoading2,
            showColumnFilters: true,
            showProgressBars: isLoading2
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
            pagination: { pageSize: 80 },
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
                <Button color='primary' onPress={() => añadir_contenedor(row.original)} size='sm'>
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
        renderTopToolbarCustomActions: ({ table }) => (
            <Box display="flex" alignItems="center" m={2}>
                <DateRangePicker
                    visibleMonths={2}
                    value={value} onChange={setValue}
                    className="max-w-xs"
                    label="Cartas porte"
                />
            </Box>
        ),
    });

    return (
        <>
            <Dialog
                open={show}
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