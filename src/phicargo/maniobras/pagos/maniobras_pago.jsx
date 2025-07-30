import * as XLSX from 'xlsx';
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
import Swal from 'sweetalert2';
import { exportToCSV } from '../../utils/export';

const ManiobrasPago = ({ show, handleClose, pago }) => {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [selectedPago, setSelectedPago] = useState(null);

    const fetchData = () => {
        setLoading(true);
        odooApi.get(`/maniobras/maniobras_pago/id_pago/${pago?.id_pago}`)
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

    const pagar_folio = async () => {
        try {
            const response = await odooApi.patch(`/maniobras/pagos_operadores_maniobras/pagar/${pago?.id_pago}`);
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

    const confirmarPago = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción marcará el folio como pagado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, pagar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                pagar_folio();
            }
        });
    };

    useEffect(() => {
        if (show) fetchData();
    }, [show]);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'inicio_programado',
            header: 'Inicio programado',
        },
        {
            accessorKey: 'terminal',
            header: 'Terminal',
        },
        {
            accessorKey: 'vehiculo',
            header: 'Vehiculo',
        },
        {
            accessorKey: 'clave',
            header: 'Clave pago',
        },
        {
            accessorKey: 'pago',
            header: 'Pago',
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
                <Button onPress={() => confirmarPago()} color='primary' isDisabled={pago?.estado == 'pagado' ? true : false}>
                    Pagar
                </Button>
                <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, `maniobras_pago_${pago?.id_pago}.csv`)}>Exportar</Button>
            </Box>
        ),
    });

    return (
        <>
            <MaterialReactTable table={table} />
        </>
    );
};

export default ManiobrasPago;
