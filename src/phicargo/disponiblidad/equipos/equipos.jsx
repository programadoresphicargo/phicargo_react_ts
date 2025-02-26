import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    CircularProgress,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import customFontTheme from '../../../theme';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { toast } from 'react-toastify';
import ManiobrasNavBar from '../../maniobras/Navbar';
import { Chip, Button } from "@heroui/react";
import HistorialVehiculo from './historial';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const { VITE_PHIDES_API_URL } = import.meta.env;

const Disponibilidad_unidades = () => {
    const [isLoading2, setLoading] = useState();
    const [data, setData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [estado, setStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [vehicle_id, setVehicle] = useState();
    const [vehicle_name, setVehicleName] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await odooApi.get('/vehicles/latest-operations/');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'vehicle_name',
                header: 'Vehículo',
            },
            {
                accessorKey: 'license_plate',
                header: 'Placas',
            },
            {
                accessorKey: 'x_status',
                header: 'Estado',
                Cell: ({ cell }) => {
                    const estado = cell.getValue() || 'desconocido';
                    let badgeClass = 'default';

                    if (estado === 'viaje') {
                        badgeClass = 'primary';
                    } else if (estado === 'maniobra') {
                        badgeClass = 'danger';
                    }

                    return (
                        <Chip color={badgeClass} size='sm'>
                            {estado}
                        </Chip>
                    );
                },
            },
            {
                accessorKey: 'referencia_viaje',
                header: 'Viaje',
            },
            {
                accessorKey: 'last_travel_end_date',
                header: 'Finalización',
            },
            {
                accessorKey: 'operador_viaje',
                header: 'Operador',
            },
            {
                accessorKey: 'last_maniobra_id',
                header: 'ID Maniobra',
            },
            {
                accessorKey: 'last_maniobra_end_date',
                header: 'Finalización maniobra',
            },
            {
                accessorKey: 'operador_maniobra',
                header: 'Operador maniobra',
            },
        ],
        [],
    );

    const handleRowClick = (row) => {
        setSelectedRow(row.original);
        setStatus(row.original.x_status);
        setOpenDialog(true);
        setVehicle(row.original.vehicle_id)
        setVehicleName(row.original.vehicle_name)
    };

    const handleUpdateStatus = async () => {
        setIsUpdating(true);
        try {
            const response = await fetch(VITE_PHIDES_API_URL + '/disponibilidad/equipos/guardar_cambios.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedRow.id,
                    estado: estado,
                }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Estado actualizado con éxito');
                setOpenDialog(false);
                fetchData();
            } else {
                toast.error('Error al actualizar el estado');
            }
        } catch (error) {
            console.error('Error en la actualización:', error);
            toast.error('Error en la actualización');
        } finally {
            setIsUpdating(false);
        }
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        state: { isLoading: isLoading2 },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => handleRowClick(row),
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
        muiTableBodyCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '14px',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 176px)',
            },
        },
    });

    return (
        <div>
            <MaterialReactTable table={table} />

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullScreen={true}>
                <AppBar
                    elevation={3} position="static"
                    sx={{
                        background: 'linear-gradient(90deg, #0b2149, #002887)',
                        padding: '0 16px'
                    }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setOpenDialog(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        {vehicle_name}
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <HistorialVehiculo vehicle_id={vehicle_id}></HistorialVehiculo>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Disponibilidad_unidades;
