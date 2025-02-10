import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Box } from '@mui/material';
import { ViajeContext } from '../../../viajes/context/viajeContext';
import { Button } from '@nextui-org/button';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { CostosExtrasContext } from '../../context/context';

const ServiciosExtras = ({ onClose }) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const { CostosExtras, setCostosExtras } = useContext(CostosExtrasContext);

    const [data, setData] = useState([]);
    const [isLoading2, setLoading] = useState();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/tipos_costos_extras/');
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
                accessorKey: 'id_tipo_costo',
                header: 'Referencia',
            },
            {
                accessorKey: 'descripcion',
                header: 'Descripción',
            },
            {
                accessorKey: 'costo',
                header: 'Costo',
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
                <h1>Servicios aplicados</h1>
            </Box>
        ),
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                const servicioSeleccionado = row.original;

                const servicioConExtras = {
                    ...servicioSeleccionado,
                    cantidad: 1,
                    iva: .16,
                    retencion: 0,
                    subtotal: servicioSeleccionado.costo,
                };

                // Actualizar el estado con el nuevo servicio
                setCostosExtras((prev) => [...prev, servicioConExtras]);
                onClose();
            },
            sx: {
                cursor: 'pointer',
            },
        }),
    });

    return (
        <>
            <MaterialReactTable table={table} />
        </>
    );
};

export default ServiciosExtras;
