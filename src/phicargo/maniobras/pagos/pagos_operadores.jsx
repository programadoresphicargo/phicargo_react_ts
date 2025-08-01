import { Button, Card, CardBody } from '@heroui/react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';
import ManiobrasPago from './maniobras_pago';
import { Snippet, Chip } from "@heroui/react";
import { exportToCSV } from '../../utils/export';
import Swal from 'sweetalert2';

const PagosOperadores = ({ show, handleClose, periodo }) => {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [selectedPago, setSelectedPago] = useState(null);

    const fetchData = () => {
        setLoading(true);
        odooApi.get(`/maniobras/pagos_operadores_maniobras/id_periodo/${periodo?.id_periodo}`)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                if (error.response) {
                    toast.error('Respuesta de error del servidor: ' + error.response.data);
                } else if (error.request) {
                    toast.error('No se recibió respuesta del servidor: ' + error.request);
                } else {
                    toast.error('Error al configurar la solicitud: ' + error.message);
                }
            });
    };

    useEffect(() => {
        if (show) fetchData();
    }, [show]);

    const columns = useMemo(() => [
        {
            accessorKey: 'id_pago',
            header: 'ID Pago',
        },
        {
            accessorKey: 'name',
            header: 'Operador',
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            Cell: ({ cell }) => {
                const value = cell.getValue();

                let variant = 'default';
                if (value === 'pagado') {
                    variant = 'success';
                }

                return (
                    <Chip color={variant} className="text-white" size="sm">
                        {value}
                    </Chip>
                );
            },
        },
        {
            accessorKey: 'total',
            header: 'Total',
        },
        {
            accessorKey: 'nombre',
            header: 'Pago',
        },
        {
            accessorKey: 'fecha_pago',
            header: 'Fecha pago',
        },
    ], []);

    const handleShowModal = (pago) => {
        setSelectedPago(pago);
        setModalShow(true);
    };

    const handleCloseModal = () => {
        setModalShow(false);
        setSelectedPago(null);
        fetchData();
    };

    const cerrar_periodo = async () => {
        try {
            const response = await odooApi.patch(`/maniobras/periodos_pagos_maniobras/cerrar/${periodo?.id_periodo}`);
            if (response.data.status == 'success') {
                toast.success(response.data.message);
                handleClose();
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            Swal.close();

            if (error.response) {
                toast.error('Error del servidor: ' + error.response.data);
            } else if (error.request) {
                toast.error('No se recibió respuesta del servidor.');
            } else {
                toast.error('Error al procesar la solicitud: ' + error.message);
            }
        }
    };

    const confirmarCerrado = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción marcará el folio como pagado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, pagar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                cerrar_periodo();
            }
        });
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableGlobalFilter: true,
        enableFilters: true,
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        state: { isLoading },
        muiCircularProgressProps: {
            color: 'primary',
            thickness: 5,
            size: 45,
        },
        muiSkeletonProps: {
            animation: 'pulse',
            height: 28,
        },
        columnFilterDisplayMode: 'popover',
        muiTablePaperProps: {
            elevation: 0,
            sx: { borderRadius: '0' },
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
                maxHeight: 'calc(100vh - 300px)',
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => handleShowModal(row.original),
            style: { cursor: 'pointer' },
        }),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button onPress={() => confirmarCerrado()} color='primary' isDisabled={periodo?.estado == 'cerrado' ? true : false}>
                    Cerrar periodo
                </Button>
                <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, `periodo_pago_maniobras_${id_periodo}.csv`)}>Exportar</Button>
            </Box>
        ),
    });

    return (
        <>
            <Dialog open={show} onClose={handleClose} fullScreen scroll="paper">
                <AppBar
                    sx={{ background: 'linear-gradient(90deg, #0b2149, #002887)', padding: '0 16px' }}
                    position="static"
                    elevation={0}
                >
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }}>
                            Periodo {periodo?.id_periodo}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <MaterialReactTable table={table} />
                </DialogContent>
            </Dialog>

            <Dialog open={modalShow} onClose={handleCloseModal} maxWidth="xl" fullScreen>
                <AppBar
                    sx={{ background: '#003366', padding: '0 16px' }}
                    position="static"
                    elevation={0}
                >
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleCloseModal} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }}>
                            Detalles del pago #{selectedPago?.id_pago}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    {selectedPago ? (
                        <Box p={2}>
                            <Typography><b>Operador:</b> {selectedPago.name}</Typography>
                            <Typography><b>Estado:</b> {selectedPago.estado}</Typography>
                            <Typography><b>Total:</b> ${selectedPago.total}</Typography>
                            <ManiobrasPago show={modalShow} pago={selectedPago} handleClose={handleCloseModal}></ManiobrasPago>
                        </Box>
                    ) : null}
                </DialogContent>
            </Dialog>

            <ToastContainer />
        </>
    );
};

export default PagosOperadores;
