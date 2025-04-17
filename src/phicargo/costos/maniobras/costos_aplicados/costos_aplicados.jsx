import { Card, CardBody } from "@heroui/react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import { CostosExtrasContext } from '../../context/context';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ServiciosExtras from './tipos_costos_extras';
import Slide from '@mui/material/Slide';
import Swal from 'sweetalert2';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

const ServiciosAplicadosCE = ({ onClose }) => {
    const { id_folio, CostosExtras, setCostosExtras, setCostosExtrasEliminados, DisabledForm, setDisabledForm, agregarConcepto, setAC, horasEstadias, setHE } = useContext(CostosExtrasContext);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const guardar = () => {
        console.log(CostosExtras);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const removeRow = (rowIndex) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el registro.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const deletedItem = CostosExtras[rowIndex];
                const updatedData = CostosExtras.filter((_, index) => index !== rowIndex);
                setCostosExtras(updatedData);
                setCostosExtrasEliminados(prev => [...prev, deletedItem]);
                toast.success('Registro eliminado correctamente');
            }
        });
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id_tipo_costo',
                header: 'Clave costo',
                enableEditing: false,
            },
            {
                accessorKey: 'descripcion',
                header: 'Descripción',
                enableEditing: false,
                size: 1,
            },
            {
                accessorKey: 'costo',
                header: 'Costo',
                enableEditing: true,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
            },
            {
                accessorKey: 'cantidad',
                header: 'Cantidad',
                enableEditing: (row) => row.original.id_tipo_costo !== 4,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
            },
            {
                accessorKey: "iva",
                header: "IVA",
                enableEditing: true,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({ row }) => {
                    const iva = row.original.iva ?? 0.16;
                    return iva.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
            },
            {
                accessorKey: "retencion",
                header: "Retención",
                enableEditing: false,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({ row }) => {
                    const costo = row.original.costo || 0;
                    const cantidad = row.original.cantidad || 1;
                    const retencion = row.original.id_tipo_costo === 1 ? (costo * cantidad) * 0.04 : 0;
                    row.original.retencion = retencion;

                    return row.original.retencion.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
            },
            {
                accessorKey: "subtotal",
                header: "Subtotal",
                enableEditing: false,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({ row }) => {
                    const costo = row.original.costo || 0;
                    const cantidad = row.original.cantidad || 1;
                    const retencion = row.original.id_tipo_costo === 1 ? (costo * cantidad) * 0.04 : 0;

                    const subtotal = (costo * cantidad) - retencion;
                    return subtotal.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
            },
            {
                accessorKey: "total",
                header: "Total",
                enableEditing: false,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({ row }) => {
                    const costo = row.original.costo || 0;
                    const cantidad = row.original.cantidad || 1;
                    const iva = row.original.iva ?? 0.16;
                    const retencion = row.original.id_tipo_costo === 1 ? (costo * cantidad) * 0.04 : 0;

                    const subtotal = (costo * cantidad) * (1 + iva) - retencion;
                    return subtotal.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
            },
            {
                accessorKey: "ajuste_cobro",
                header: "Ajuste",
                enableEditing: true,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({ row }) => {
                    // Si ajuste_cobro es null o undefined, tomar el valor de subtotal
                    const subtotal = (() => {
                        const costo = row.original.costo || 0;
                        const cantidad = row.original.cantidad || 1;
                        const iva = row.original.iva ?? 0.16;
                        const retencion = row.original.id_tipo_costo === 1 ? (costo * cantidad) * 0.04 : 0;
                        return (costo * cantidad) * (1 + iva) - retencion;
                    })();

                    row.original.ajuste_cobro = row.original.ajuste_cobro ?? subtotal;

                    return row.original.ajuste_cobro.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
                muiTableBodyCellEditTextFieldProps: {
                    type: "number",
                    onChange: (event) => {
                        const value = parseFloat(event.target.value) || 0;
                        row.original.ajuste_cobro = value; // Permitir edición manual
                    },
                },
            },
            {
                accessorKey: 'comentarios',
                header: 'Comentarios',
                enableEditing: true,
            },
        ],
        []
    );

    const totalSubtotal = useMemo(() => {
        return CostosExtras.reduce((total, item) => {
            const costo = item.costo || 0;
            const cantidad = item.cantidad || 1;
            const iva = item.iva ?? 0.16;
            const retencion = item.id_tipo_costo === 1 ? (costo * cantidad) * -0.04 : 0;

            const subtotal = (costo * cantidad) * (1 + iva) + retencion;
            return total + subtotal;
        }, 0).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }, [CostosExtras]);


    const table = useMaterialReactTable({
        columns,
        data: CostosExtras,
        enableEditing: true,
        editDisplayMode: 'modal',
        positionActionsColumn: 'last',
        state: { showProgressBars: loading },
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        onEditingRowSave: ({ row, values, exitEditingMode }) => {
            const updatedData = [...CostosExtras];
            const updatedRow = { ...row.original, ...values };

            updatedRow.costo = parseFloat(updatedRow.costo) || 0;
            updatedRow.cantidad = parseFloat(updatedRow.cantidad) || 1;
            updatedRow.subtotal = updatedRow.costo * updatedRow.cantidad;

            updatedData[row.index] = updatedRow;
            setCostosExtras(updatedData);
            exitEditingMode();
            toast.success('Registro actualizado');
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
                    Costos extras
                </h1>
                <Button onPress={handleClickOpen} color="primary" size="md" isDisabled={DisabledForm} startContent={<i class="bi bi-plus-lg"></i>}>
                    Añadir costo extra
                </Button>
            </Box>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '8px' }}>
                <Button
                    color="primary"
                    size="sm"
                    className='text-white'
                    isDisabled={DisabledForm}
                    onPress={() => table.setEditingRow(row)}
                >
                    Editar
                </Button>
                <Button
                    color="danger"
                    size="sm"
                    isDisabled={DisabledForm}
                    onPress={() => removeRow(row.index)}
                >
                    Eliminar
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


    const agregarServicioConExtras = () => {
        if (agregarConcepto) {
            const servicioConExtras = {
                id_tipo_costo: 4,
                descripcion: 'Estadias',
                costo: 0,
                cantidad: horasEstadias,
                iva: .16,
                retencion: 0,
                subtotal: 0,
                total: 0,
                ajuste_cobro: 0,
                comentarios: ''
            };

            setCostosExtras((prev) => [...prev, servicioConExtras]);
        } else {
            console.log("No se agrega el servicio debido a la condición de contexto.");
        }
    };

    useEffect(() => {
        agregarServicioConExtras();
    }, []);

    return (
        <>
            <Card>
                <CardBody>
                    <MaterialReactTable table={table} />
                </CardBody>
            </Card>

            <Dialog
                fullWidth={true}
                maxWidth="lg"
                scroll='body'
                open={open}
                onClose={handleClose}
            >
                <AppBar sx={{ position: 'relative' }} elevation={0}>
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
                            Costos extras
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

export default ServiciosAplicadosCE;

