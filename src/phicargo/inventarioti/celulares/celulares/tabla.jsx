import { Button, Chip } from '@heroui/react';
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
import FormCelulares from './form';
import {
    useDisclosure,
} from "@heroui/react";
const CelularesTabla = ({ active }) => {
    const [isLoading, setLoading] = useState(false);
    const [id_celular, setCelular] = useState(0);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/inventarioti/dispositivos/celular/' + active);
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
            { accessorKey: 'id_celular', header: 'ID Celular' },
            { accessorKey: 'nombre', header: 'Empresa' },
            { accessorKey: 'imei', header: 'IMEI' },
            { accessorKey: 'marca', header: 'Marca' },
            { accessorKey: 'modelo', header: 'Modelo' },
            { accessorKey: 'correo', header: 'Correo' },
            { accessorKey: 'passwoord', header: 'Contraseña' },
            {
                accessorKey: 'estado', header: 'Estado',
                Cell: ({ row }) => (
                    <Chip
                        className='text-white'
                        color={row.original.estado == 'disponible' ? 'success' : 'primary'}
                        variant="solid"
                        size='sm'
                    >
                        {row.original.estado}
                    </Chip >
                ),
            },
            { accessorKey: 'fecha_baja', header: 'Fecha baja' },
            { accessorKey: 'motivo_baja', header: 'Motivo baja' },
            { accessorKey: 'comentarios_baja', header: 'Comentarios baja' },
            { accessorKey: 'nombre_empleado_baja', header: 'Empleado baja' },
        ],
        [active],
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
            columnVisibility: {
                motivo_baja: active ? false : true,
                comentarios_baja: active ? false : true,
                fecha_baja: active ? false : true,
                nombre_empleado_baja: active ? false : true,
            },
        },
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            pagination: { pageSize: 80 },
            showColumnFilters: true,
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
                setCelular(row.original.id_celular);
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
                    Celulares
                </h1>
                <Button color="primary"
                    onPress={() => {
                        onOpen();
                        setCelular(null);
                    }}>Nuevo</Button>

                <Button color="danger"
                    onPress={() => {
                        fetchData();
                    }}>Refrescar
                </Button>
            </Box >
        ),
    });

    return (
        <div>
            <MaterialReactTable table={table} />
            <FormCelulares isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} id_celular={id_celular}></FormCelulares>
        </div>
    );
};

export default CelularesTabla;

