import { Button, Chip, Tooltip } from "@heroui/react";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
} from '@mui/material';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { exportToCSV } from '../utils/export';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import FormularioRemolques from "./formulario";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const Disponibilidad_unidades = () => {
    const [isLoading2, setLoading] = useState();
    const [data, setData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [vehicle_data, setVehicle] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await odooApi.get('/vehicles/remolques/');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [openDialog]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name2',
                header: 'Vehículo',
                Cell: ({ cell }) => {
                    const tipo_carga = cell.getValue();

                    return (
                        <Chip color="primary" size="sm">
                            {tipo_carga}
                        </Chip>
                    );
                },
            },
            {
                accessorKey: 'license_plate',
                header: 'Placas',
            },
            {
                accessorKey: 'categoria',
                header: 'Tipo de vehiculo',
            },
            {
                accessorKey: 'fleet_type',
                header: 'Tipo',
            },
            {
                accessorKey: 'sucursal',
                header: 'Sucursal',
            },
            {
                accessorKey: 'x_status',
                header: 'Estado',
            },
            {
                accessorKey: 'viaje_name',
                header: 'Viaje',
                Cell: ({ cell, row }) => {
                    const valor = cell.getValue(); // viaje_name
                    const estado = row.original.viaje_estado; // aquí obtienes viaje_estado

                    // No mostrar si viaje_name es nulo
                    if (!valor) return null;

                    return (
                        <Tooltip content={`Estado: ${estado ?? 'N/A'}`}>
                            <Button className="capitalize" color="primary" size="sm" radius="full">
                                {valor}
                            </Button>
                        </Tooltip>
                    );
                },
            },
            {
                accessorKey: 'x_maniobra',
                header: 'Maniobra',
                Cell: ({ cell, row }) => {
                    const valor = cell.getValue();
                    const estado = row.original.estado_maniobra;
                    const tipo = row.original.tipo_maniobra;

                    if (!valor) return null;

                    return (
                        <Tooltip content={`Estado: ${estado ?? 'N/A'}`}>
                            <Button className="capitalize" color="secondary" size="sm" radius="full">
                                {valor} {tipo}
                            </Button>
                        </Tooltip>
                    );
                },
            },
            {
                accessorKey: 'mantenimiento_id',
                header: 'Mantenimiento',
                Cell: ({ cell, row }) => {
                    const valor = cell.getValue();
                    const estado = row.original.mantenimiento_status;
                    const tipo = row.original.tipo_maniobra;

                    if (!valor) return null;

                    return (
                        <Tooltip content={`Estado: ${estado ?? 'N/A'}`}>
                            <Button className="text-white" color="success" size="sm" radius="full">
                                {valor} {tipo}
                            </Button>
                        </Tooltip>
                    );
                },
            },
            {
                accessorKey: 'x_modalidad',
                header: 'Modalidad',
                Cell: ({ cell }) => {
                    const modalidad = cell.getValue();

                    // ❗ Si está vacío, null o undefined → no retorna nada
                    if (!modalidad) return null;

                    let color =
                        modalidad === 'sencillo' ? 'warning' :
                            modalidad === 'full' ? 'danger' :
                                'default';

                    return (
                        <Chip color={color} size="sm" className="text-white">
                            {modalidad}
                        </Chip>
                    );
                },
            },
            {
                accessorKey: 'x_tipo_carga',
                header: 'Tipo de carga',
                Cell: ({ cell }) => {
                    const tipo_carga = cell.getValue();

                    // ❗ Si está vacío, null o undefined → no retorna nada
                    if (!tipo_carga) return null;

                    let color =
                        tipo_carga === 'general' ? 'success' :
                            tipo_carga === 'imo' ? 'danger' :
                                'default';

                    return (
                        <Chip color={color} size="sm" className="text-white">
                            {tipo_carga}
                        </Chip>
                    );
                },
            },
            {
                accessorKey: 'x_altura_compatible',
                header: 'Altura',
            },
            {
                accessorKey: 'x_longitud_compatible',
                header: 'Longitud',
            },
        ],
        [],
    );

    const handleRowClick = (row) => {
        setOpenDialog(true);
    };

    const table = useMaterialReactTable({
        columns,
        data,
        localization: MRT_Localization_ES,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        initialState: {
            density: 'compact',
            showColumnFilters: true,
            pagination: { pageSize: 80 },
        },
        state: { showProgressBars: isLoading2 },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => { handleRowClick(row); setVehicle(row.original) },
            style: {
                cursor: 'pointer',
            },
        }),
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
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 190px)',
            },
        },
        muiTablePaperProps: { elevation: 0, sx: { borderRadius: '0', }, },
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
                    Remolques
                </h1>
                <Button
                    size="sm"
                    color='success'
                    className='text-white'
                    startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "unidades.csv")}
                    radius="full">
                    Exportar
                </Button>
                <Button
                    size="sm"
                    color='danger'
                    className='text-white'
                    startContent={<i class="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()}
                    radius="full">
                    Recargar
                </Button>
            </Box>
        ),
    });

    return (
        <div>
            <MaterialReactTable table={table} />

            <FormularioRemolques isOpen={openDialog} onOpenChange={setOpenDialog} vehicle_data={vehicle_data}></FormularioRemolques>
        </div>
    );
};

export default Disponibilidad_unidades;
