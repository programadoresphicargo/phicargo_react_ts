import odooApi from "@/api/odoo-api";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, NumberInput, Input, DatePicker, Textarea, Progress, Checkbox
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import toast from 'react-hot-toast';
import { parseDate } from "@internationalized/date";
import BajaCelular from "./baja_form";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import HistorialAsignaciones from "../asignacion/historial";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

export default function EmpleadosSinAsignarCelular({ isOpen, onOpenChange, id_celular }) {

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/inventarioti/empleados/activo/true');
            setData(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [id_celular, isOpen]);

    const columns = useMemo(
        () => [
            { accessorKey: 'nombre_empleado', header: 'Nombre empleado' },
            { accessorKey: 'celular_asignado', header: 'Correo' },
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
                <h1
                    className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
                >
                    Empleados sin asignaciòn
                </h1>
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
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="outside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>
                                <MaterialReactTable table={table} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    );
}
