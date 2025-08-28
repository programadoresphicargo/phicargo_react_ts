import odooApi from "@/api/odoo-api";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, NumberInput, Input, DatePicker, Textarea, Progress, Checkbox
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import toast from 'react-hot-toast';
import { parseDate } from "@internationalized/date";
import BajaCelular from "../../celulares/baja_form";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import HistorialAsignaciones from "../../asignacion/historial";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

export default function DispositivosSinAsignar({ tipo }) {

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/inventarioti/empleados/activo/true');
            if (tipo == 'celular') {
                const filtrados = response.data.filter(item => item.tiene_celular === 'No');
                setData(filtrados);
            } else {
                const filtrados = response.data.filter(item => item.tiene_computo === 'No');
                setData(filtrados);
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            { accessorKey: 'nombre_empleado', header: 'Nombre empleado' },
            { accessorKey: 'puesto', header: 'Puesto' },
            { accessorKey: 'tiene_celular', header: 'Tiene celular' },
            { accessorKey: 'tiene_computo', header: 'Tiene computo' },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        localization: MRT_Localization_ES,
        state: {
            showProgressBars: isLoading,
        },
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            pagination: { pageSize: 80 },
            showColumnFilters: true,
            columnVisibility:
            {
                tiene_celular: tipo == 'celular' ? true : false,
                tiene_computo: tipo == 'computo' ? true : false,
            }
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
            },
            style: {
                cursor: 'pointer',
            },
        }),
        muiTableHeadCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'Bold',
                fontSize: '14px',
            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '14px',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 260px)',
            },
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button color="danger"
                    onPress={() => {
                        fetchData();
                    }}>Refrescar
                </Button>
            </Box >
        ),
    });

    return (
        <>
            <MaterialReactTable table={table} />
        </>
    );
}
