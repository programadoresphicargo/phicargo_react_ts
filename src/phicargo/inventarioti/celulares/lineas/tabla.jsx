import { Button, Checkbox, Chip, User } from '@heroui/react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { DatePicker } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import NavbarInventarioTI from '../../navbar';
import {
    useDisclosure,
} from "@heroui/react";
import { exportToCSV } from '../../../utils/export';
import FormLineas from './form';

const LineasTabla = ({ active }) => {
    const [isLoading, setLoading] = useState(false);
    const [id_linea, setCelular] = useState(0);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get(`/inventarioti/lineas/${active}`);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isOpen]);

    const columns = useMemo(
        () => [
            { accessorKey: 'id_linea', header: 'ID Linea' },
            { accessorKey: 'empresa', header: 'Empresa' },
            { accessorKey: 'numero', header: 'Numero' },
            { accessorKey: 'compañia', header: 'Compañia' },
            { accessorKey: 'plan', header: 'Plan' },
            {
                accessorKey: 'activo',
                header: 'Activo',
                Cell: ({ cell }) => {
                    const activo = cell.getValue();

                    return (
                        <Checkbox size="sm" isSelected={activo ? true : false}>
                            Activo
                        </Checkbox>
                    );
                },
            },
            {
                accessorKey: 'estado',
                header: 'Estado',
                Cell: ({ cell }) => {
                    const estado = cell.getValue();

                    return (
                        <Chip color="primary" size="sm" color={estado == 'asignada' ? 'success' : 'primary'} className='text-white'>
                            {estado}
                        </Chip>
                    );
                },
            },
            {
                accessorKey: 'nombre_empleado',
                header: 'Asignado',
                Cell: ({ row }) => {
                    const nombre = row.original.nombre_empleado;

                    // Si es nulo o vacío, no renderiza nada
                    if (!nombre) return null;

                    return (
                        <User
                            avatarProps={{
                                isBordered: true,
                                size: 'sm',
                                color: 'primary'
                            }}
                            name={nombre}
                            description={row.original.puesto}
                        />
                    );
                },
            }
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
        state: { showProgressBars: isLoading },
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            pagination: { pageSize: 80 },
            showColumnFilters: true,
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
                setCelular(row.original.id_linea);
                onOpen();
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
                maxHeight: 'calc(100vh - 270px)',
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
                    Lineas celulares
                </h1>
                <Button
                    radius='full'
                    color="primary"
                    onPress={() => {
                        onOpen();
                        setCelular(null);
                    }}>
                    Nueva
                </Button>

                <Button
                    radius='full'
                    color="danger"
                    onPress={() => {
                        fetchData();
                    }}>Refrescar
                </Button>
                <Button
                    radius='full'
                    color='success'
                    className='text-white'
                    startContent={<i class="bi bi-file-earmark-excel"></i>}
                    onPress={() => exportToCSV(data, columns, "lineas.csv")}>
                    Exportar
                </Button>
            </Box >
        ),
    });

    return (
        <div>
            <MaterialReactTable table={table} />
            <FormLineas isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} id_linea={id_linea}></FormLineas>
        </div>
    );
};

export default LineasTabla;

