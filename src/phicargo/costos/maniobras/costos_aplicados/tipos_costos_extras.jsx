import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import { CostosExtrasContext } from '../../context/context';
import { ViajeContext } from '../../../viajes/context/viajeContext';
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const ServiciosExtras = ({ onClose }) => {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const { CostosExtras, setCostosExtras, agregarConcepto, setAC } = useContext(CostosExtrasContext);

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
            {
                accessorKey: 'unidad_medida',
                header: 'Unidad medida',
            },
            {
                accessorKey: 'observaciones',
                header: 'Observaciones',
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
                <h1>Catalogo de costos extras</h1>
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
                    ajuste_cobro: 0
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
