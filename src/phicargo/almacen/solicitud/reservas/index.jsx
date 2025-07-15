import React, { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Dialog, DialogContent, DialogTitle, Stack, TextField, Box } from '@mui/material';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Button } from '@heroui/react';
import { useAlmacen } from '../../contexto/contexto';
import SearchUnidad from './search_unidad';

const ReservasDetalle = ({ open, handleClose, data, estado }) => {

    const { reservasGlobales, setReservasGlobales, modoEdicion, setModoEdicion } = useAlmacen();
    const [reservasLinea, setReservasLinea] = useState([]);

    useEffect(() => {
        const filtradas = reservasGlobales.filter(r => r.id_solicitud_equipo_line === data.id);
        setReservasLinea(filtradas);
    }, [data, reservasGlobales]);

    const updateReserva = () => {
        setReservasGlobales(prev =>
            prev.map(r =>
                r.id_reserva === form.id_reserva ? { ...r, ...form } : r
            )
        );
    };

    const deleteReserva = (id) => {
        setReservasGlobales(prev => prev.filter(r => r.id_reserva !== id));
    };

    const handleEdit = (row) => {
        setForm(row);
    };

    const columns = useMemo(
        () => [
            { accessorKey: 'id_reserva', header: 'ID' },
            { accessorKey: 'id_solicitud_equipo_line', header: 'ID' },
            { accessorKey: 'id_unidad', header: 'Unidad' },
            { accessorKey: 'fecha_reserva', header: 'Fecha' },
            {
                accessorKey: 'devuelta',
                header: '¿Devuelta?',
                Cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.original.devuelta}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setReservasGlobales(prev =>
                                prev.map(r =>
                                    r.id_reserva === row.original.id_reserva
                                        ? { ...r, devuelta: checked }
                                        : r
                                )
                            );
                        }}
                    />
                ),
            },
        ],
        []
    );

    const marcarTodas = (valor) => {
        const idsLinea = reservasLinea.map(r => r.id_reserva);
        setReservasGlobales(prev =>
            prev.map(r =>
                idsLinea.includes(r.id_reserva)
                    ? { ...r, devuelta: valor }
                    : r
            )
        );
    };

    const table = useMaterialReactTable({
        columns,
        data: reservasLinea,
        localization: MRT_Localization_ES,
        initialState: {
            columnVisibility: {
                devuelta: estado == 'confirmado' ? true : true,
            },
            density: 'compact',
            showColumnFilters: true,
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
        renderTopToolbarCustomActions: () => (
            <>
                <SearchUnidad data={data}></SearchUnidad>
                {estado === 'confirmado' && (
                    <>
                        <Button color="primary" onPress={() => marcarTodas(true)}>
                            Marcar todas
                        </Button>
                        <Button color="danger" onPress={() => marcarTodas(false)}>
                            Desmarcar todas
                        </Button>
                    </>
                )},
            </>
        ),
        renderRowActions: ({ row }) => (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onPress={() => deleteReserva(row.original.id_reserva)} color='danger' size='sm' isDisabled={estado == "entregado" || modoEdicion ? false : true}>Eliminar</Button>
            </Box>
        ),
        enableRowActions: true,
    });

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle>Equipo asignado</DialogTitle>
            <DialogContent>
                <MaterialReactTable table={table} />
            </DialogContent>
        </Dialog>
    );
};

export default ReservasDetalle;
