import React, { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Dialog, DialogContent, DialogTitle, Stack, TextField, Box, DialogActions } from '@mui/material';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Button, Select, SelectItem, Textarea, Checkbox } from '@heroui/react';
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
            { accessorKey: 'id_solicitud_equipo_line', header: 'ID Linea' },
            { accessorKey: 'id_unidad', header: 'Unidad' },
            { accessorKey: 'x_name', header: 'Descripción' },
            {
                accessorKey: 'devuelta',
                header: '¿Devuelta?',
                Cell: ({ row }) => {
                    const reserva = row.original;
                    return (
                        <>
                            <Checkbox
                                isSelected={reserva.devuelta || false}
                                onChange={(e) => {
                                    const checked = e.target.checked; // ✅ Así se obtiene el valor real del checkbox

                                    setReservasGlobales((prev) =>
                                        prev.map((r) =>
                                            r.id_reserva === reserva.id_reserva
                                                ? {
                                                    ...r,
                                                    devuelta: checked,
                                                    motivo_no_devuelta: '',
                                                    comentarios_no_devuelta: '',
                                                }
                                                : r
                                        )
                                    );
                                }}
                            >
                                ¿Producto devuelto?
                            </Checkbox>
                        </>
                    );
                },
            },
            {
                accessorKey: 'motivo_no_devuelta',
                header: 'Motivo (si no devuelto)',
                Cell: ({ row }) => {
                    const reserva = row.original;
                    if (reserva.devuelta) return null;
                    return (
                        <>
                            <Select
                                className="max-w-xs"
                                selectedKeys={[reserva.motivo_no_devuelta || '']}
                                variant="bordered"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setReservasGlobales((prev) =>
                                        prev.map((r) =>
                                            r.id_reserva === reserva.id_reserva
                                                ? { ...r, motivo_no_devuelta: value }
                                                : r
                                        )
                                    );
                                }}
                            >
                                <SelectItem key={'extraviado'}>Extraviado</SelectItem>
                                <SelectItem key={'dañado'}>Dañado</SelectItem>
                            </Select>
                        </>
                    );
                },
            },
            {
                accessorKey: 'comentarios_no_devuelta',
                header: 'Comentarios (si no devuelto)',
                Cell: ({ row }) => {
                    const reserva = row.original;
                    if (reserva.devuelta) return null;
                    return (
                        <>
                            <Textarea
                                className="max-w-xs"
                                labelPlacement="inside"
                                variant='bordered'
                                placeholder="Ingresa un comentario"
                                value={reserva.comentarios_no_devuelta || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setReservasGlobales((prev) =>
                                        prev.map((r) =>
                                            r.id_reserva === reserva.id_reserva
                                                ? { ...r, comentarios_no_devuelta: value }
                                                : r
                                        )
                                    );
                                }}
                            />
                        </>
                    );
                },
            },
        ],
        [setReservasGlobales]
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
        muiTableBodyCellProps: ({ row }) => ({
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '12px',
            },
        }),
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
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
            <DialogTitle>Equipo asignado</DialogTitle>
            <DialogContent>
                <MaterialReactTable table={table} />
            </DialogContent>
            <DialogActions>
                <Button onPress={handleClose} color='primary'>Listo</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReservasDetalle;
