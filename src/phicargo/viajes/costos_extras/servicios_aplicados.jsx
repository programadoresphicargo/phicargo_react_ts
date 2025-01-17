import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Box } from '@mui/material';
import { ViajeContext } from '../context/viajeContext';
import { Button } from '@nextui-org/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import FormularioDocumentacion from './formulario';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { toast } from 'react-toastify';
import FormularioCostoExtra from './formulario';
import { Card, CardBody } from '@nextui-org/react';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ServiciosExtras from './servicios_extras';
import { CostosExtrasContext } from '../context/costosContext';

const ServiciosAplicados = ({ onClose }) => {
    const { id_viaje } = useContext(ViajeContext);
    const { ServiciosAplicados, setServiciosAplicados } = useContext(CostosExtrasContext);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const guardar = () => {
        console.log(ServiciosAplicados);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const removeRow = (rowIndex) => {
        const updatedData = ServiciosAplicados.filter((_, index) => index !== rowIndex);
        setServiciosAplicados(updatedData);
        toast.success('Registro eliminado correctamente');
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id_servicio',
                header: 'Clave servicio',
                enableEditing: false, // Campo no editable
            },
            {
                accessorKey: 'nombre_servicio',
                header: 'Nombre del Servicio',
                enableEditing: false, // Campo no editable
            },
            {
                accessorKey: 'costo',
                header: 'Costo',
                enableEditing: true, // Campo editable
                muiTableBodyCellProps: {
                    align: 'right',
                },
            },
            {
                accessorKey: 'cantidad',
                header: 'Cantidad',
                enableEditing: true, // Campo editable
                muiTableBodyCellProps: {
                    align: 'right',
                },
            },
            {
                accessorKey: 'subtotal',
                header: 'Subtotal',
                enableEditing: false, // Calculado, no editable
                Cell: ({ row }) => {
                    const subtotal =
                        (row.original.costo || 0) * (row.original.cantidad || 1);
                    return subtotal.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
                muiTableBodyCellProps: {
                    align: 'right',
                },
            },
        ],
        []
    );

    const totalSubtotal = useMemo(() => {
        return ServiciosAplicados.reduce((total, item) => {
            const subtotal = (item.costo || 0) * (item.cantidad || 1);
            return total + subtotal;
        }, 0).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }, [ServiciosAplicados]);

    const table = useMaterialReactTable({
        columns,
        data: ServiciosAplicados,
        enableEditing: true,
        editDisplayMode: 'row',
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        onEditingRowSave: ({ row, values, exitEditingMode }) => {
            const updatedData = [...ServiciosAplicados];
            const updatedRow = { ...row.original, ...values };

            updatedRow.costo = parseFloat(updatedRow.costo) || 0;
            updatedRow.cantidad = parseFloat(updatedRow.cantidad) || 1;
            updatedRow.subtotal = updatedRow.costo * updatedRow.cantidad;

            updatedData[row.index] = updatedRow;
            setServiciosAplicados(updatedData);
            exitEditingMode();
            toast.success('Fila actualizada correctamente');
        },
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
                borderRadius: '8px',
                overflow: 'hidden',
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
                <h1>Servicios aplicados</h1>
                <Button onPress={guardar} color="primary" size="sm">
                    Guardar
                </Button>
                <Button onPress={handleClickOpen} color="primary" size="sm">
                    Añadir servicio
                </Button>
            </Box>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '8px' }}>
                <Button
                    color="success"
                    size="sm"
                    className='text-white'
                    onPress={() => table.setEditingRow(row)}
                >
                    Editar
                </Button>
                <Button
                    color="danger"
                    size="sm"
                    onPress={() => removeRow(row.index)}
                >
                    Quitar
                </Button>
            </Box>
        ),
        renderBottomToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '8px',
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: '#f9f9f9',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total: ${totalSubtotal}
                </Typography>
            </Box>
        ),
    });

    return (
        <>
            <Card className="mt-3">
                <CardBody>
                    <MaterialReactTable table={table} />
                </CardBody>
            </Card>

            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={open}
                onClose={handleClose}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Servicios extras
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            Cerrar
                        </Button>
                    </Toolbar>
                </AppBar>
                <ServiciosExtras onClose={handleClose} />
            </Dialog>
        </>
    );
};

export default ServiciosAplicados;

