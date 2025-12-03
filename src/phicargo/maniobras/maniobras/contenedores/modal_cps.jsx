import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Box } from '@mui/material';
import { Button } from '@heroui/react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Select, SelectItem } from "@heroui/react";
import { ManiobraContext } from '../../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { DateRangePicker } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const AñadirContenedor = ({ show, handleClose, id_maniobra }) => {

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
    const [isLoading2, setILoading] = useState();
    const { cps_ligadas, setCpsLigadas, cps_desligadas, setCpsDesligadas } = useContext(ManiobraContext);

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
        toast.success('Añadiendo contenedor');

        const yaExiste = cps_ligadas?.some(item => item.id === data.id);
        if (yaExiste) {
            toast.warn('Este contenedor ya ha sido añadido.');
            return;
        }

        setCpsLigadas(prev => [...(prev || []), data]);

        handleClose();
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'sucursal',
                header: 'Sucursal',
            },
            {
                accessorKey: 'carta_porte',
                header: 'Carta porte',
            },
            {
                accessorKey: 'cliente',
                header: 'Cliente',
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
            },
            {
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
            showProgressBars: isLoading2,
            showColumnFilters: true
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
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 385px)',
                boxShadow: 'none',
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            sx: {
                fontWeight: 'normal',
                fontSize: '24px',
                backgroundColor: row.getIsGrouped() ? '#246cd0' : 'inherit',
                color: 'white',
            },
            style: {
                cursor: 'pointer',
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
                fullWidth="xl"
                maxWidth="xl"
            >
                <DialogTitle id="example-custom-modal-styling-title">
                    Contenedores
                </DialogTitle>
                <DialogContent>
                    <MaterialReactTable table={table} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AñadirContenedor;