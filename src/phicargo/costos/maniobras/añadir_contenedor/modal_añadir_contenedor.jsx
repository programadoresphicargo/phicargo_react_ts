import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Box } from '@mui/material';
import { Button } from '@nextui-org/react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import { Select, SelectItem } from '@nextui-org/react';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { CostosExtrasContext } from '../../context/context';
import { DateRangePicker } from "rsuite";

const AñadirContenedor = ({ show, handleClose }) => {

    const { id_folio, CartasPorte, setCPS } = useContext(CostosExtrasContext);

    const [data, setData] = useState([]);
    const [isLoading2, setILoading] = useState();
    const [range, setRange] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setILoading(true);
                const response = await odooApi.get('/tms_waybill/get_by_date_range/2025-01-01/2025-01-31');
                setData(response.data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setILoading(false);
            }
        };

        fetchData();
    }, []);

    const añadir_contenedor = (data) => {
        setCPS(prevCartasPorte => [...prevCartasPorte, data]);
        handleClose();
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Carta porte',
            },
            {
                accessorKey: 'x_ejecutivo_viaje_bel',
                header: 'Ejecutivo de viaje',
                size: 150,
            },
            {
                accessorKey: 'x_reference',
                header: 'Contenedor',
                size: 150,
            }, {
                accessorKey: 'date_order',
                header: 'Fecha',
                size: 150,
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        elevation: 0,
        enableGrouping: true,
        enableGlobalFilter: false,
        enableFilters: true,
        state: { showProgressBars: isLoading2 },
        state: {
            isLoading: isLoading2,
            showColumnFilters: true
        },
        muiCircularProgressProps: {
            color: 'primary',
            thickness: 5,
            size: 45,
        },
        muiSkeletonProps: {
            animation: 'pulse',
            height: 28,
        },
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        muiTableBodyCellProps: {
            sx: {
                borderBottom: '1px solid #e0e0e0', 
            },
        },
        enableRowActions: true,
        displayColumnDefOptions: {
            'mrt-row-actions': {
                header: 'Seleccionar', 
                size: 100, 
            },
        },
        renderRowActions: ({ row }) => (
            <Box>
                <Button color='primary' onPress={() => añadir_contenedor(row.original)} size='sm'>
                    Añadir
                </Button>
            </Box>
        ),
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 385px)',
                boxShadow: 'none',
            },
        },
        muiTableHeadCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'Bold',
                fontSize: '14px',
            },
        },
        muiTableBodyCellProps: ({ row }) => ({
            sx: {
                backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '14px',
                color: row.subRows?.length ? '#FFFFFF' : '#000000',
            },
        }),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box display="flex" alignItems="center" m={2}>
                <h3>Selecciona un rango de fechas:</h3>
                <DateRangePicker
                    sx={{ zIndex: 1000 }}
                    placeholder="Selecciona un rango"
                    value={range}
                    onChange={setRange}
                    format="yyyy-MM-dd"
                    size="lg"
                    cleanable
                />
                {range && (
                    <p>
                        Fechas seleccionadas: <b>{range[0]?.toLocaleDateString()}</b> -{" "}
                        <b>{range[1]?.toLocaleDateString()}</b>
                    </p>
                )}
            </Box>
        ),
    });

    return (
        <>
            <Dialog
                open={show}
                onClose={handleClose}
                fullWidth="xl"
                maxWidth="xl"
            >
                <DialogTitle id="example-custom-modal-styling-title">
                    Cartas porte
                </DialogTitle>
                <DialogContent>
                    <MaterialReactTable table={table} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AñadirContenedor;