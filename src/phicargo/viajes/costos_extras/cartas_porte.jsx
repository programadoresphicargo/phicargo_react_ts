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

const CartasPorteCostoExtra = ({ }) => {

    const { id_viaje } = useContext(ViajeContext);
    const [data, setData] = useState([]);
    const [isLoading2, setLoading] = useState();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_waybill/get_by_travel_id/' + id_viaje);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Referencia',
            },
            {
                accessorKey: 'x_reference',
                header: 'Referencia',
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        state: { isLoading: isLoading2 },
        enableColumnPinning: true,
        enableStickyHeader: true,
        columnResizeMode: "onEnd",
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
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
                <h1>Cartas porte</h1>
            </Box>
        )
    });

    return (
        <>
            <Card className='mt-3'>
                <CardBody>
                    <MaterialReactTable table={table} />
                </CardBody>
            </Card>
        </>
    );
};

export default CartasPorteCostoExtra;
