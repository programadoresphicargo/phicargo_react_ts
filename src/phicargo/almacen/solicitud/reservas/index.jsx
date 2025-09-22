import React, { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Dialog, DialogContent, DialogTitle, Stack, TextField, Box, DialogActions } from '@mui/material';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Button, Select, SelectItem, Textarea, Checkbox, Chip, RadioGroup, Radio } from '@heroui/react';
import { useAlmacen } from '../../contexto/contexto';
import SearchUnidad from './search_unidad';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import odooApi from '@/api/odoo-api';
import { User } from "@heroui/user";

const ReservasDetalle = ({ open, handleClose, dataLinea }) => {
    const { reservasGlobales, setReservasGlobales, modoEdicion, setModoEdicion, data, fetchData } = useAlmacen();
    const mostrarColumnasRecepcion = ['entregado', 'recepcionado_operador', 'devuelto'].includes(data?.x_studio_estado);
    const [reservasLinea, setReservasLinea] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const filtradas = reservasGlobales.filter(r => r.id_solicitud_equipo_line === dataLinea.id);
        setReservasLinea(filtradas);
    }, [dataLinea, reservasGlobales]);

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
            { accessorKey: 'id_unidad', header: 'Unidad' },
            { accessorKey: 'x_name', header: 'Descripción' },
            {
                accessorKey: 'recibido_operador', header: 'Recibido operador', Cell: ({ row }) => {
                    const valor = row.original.recibido_operador;
                    var respuesta = '';
                    if (valor == true) {
                        respuesta = 'Sí';
                    } else if (valor == false) {
                        respuesta = 'No';
                    } else {
                        respuesta = 'Por confirmar';
                    }
                    return (
                        <>
                            <Chip color={respuesta == 'Sí' ? 'success' : 'danger'} className='text-white'>{respuesta}</Chip>
                        </>
                    );
                },
            },
            { accessorKey: 'fecha_recibido_operador', header: 'Fecha recibido operador' },
            { accessorKey: 'observaciones_operador', header: 'Observaciones operador' },
            {
                accessorKey: 'devuelta',
                header: '¿Devuelta?',
                Cell: ({ row }) => {
                    const reserva = row.original;
                    console.log(reserva.devuelta);
                    return (
                        <>
                            <RadioGroup
                                label="¿Producto devuelto?"
                                orientation="horizontal"
                                value={
                                    reserva.devuelta === null
                                        ? null // 👈 no selecciona nada
                                        : reserva.devuelta
                                            ? "si"
                                            : "no"
                                }
                                isDisabled={row.original.fecha_devuelto != null}
                                onValueChange={(value) => {
                                    let checked = null;

                                    if (value === "si") {
                                        checked = true;
                                    } else if (value === "no") {
                                        checked = false;
                                    }

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
                                <Radio value="si">Sí</Radio>
                                <Radio value="no">No</Radio>
                            </RadioGroup>
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
                                isDisabled={row.original.fecha_devuelto != null ? true : false}
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
                    const [localValue, setLocalValue] = React.useState(reserva.comentarios_no_devuelta || "");

                    React.useEffect(() => {
                        setLocalValue(reserva.comentarios_no_devuelta || "");
                    }, [reserva.comentarios_no_devuelta]);

                    if (reserva.devuelta) return null;

                    return (
                        <Textarea
                            className="max-w-xs"
                            variant="bordered"
                            placeholder="Ingresa un comentario"
                            value={localValue}
                            isDisabled={row.original.fecha_devuelto != null}
                            onChange={(e) => {
                                const value = e.target.value;
                                setLocalValue(value);
                                setReservasGlobales((prev) =>
                                    prev.map((r) =>
                                        r.id_reserva === reserva.id_reserva
                                            ? { ...r, comentarios_no_devuelta: value }
                                            : r
                                    )
                                );
                            }}
                        />
                    );
                }
            },
            {
                accessorKey: 'fecha_devuelto',
                header: 'Fecha devuelto',
                Cell: ({ row }) => {
                    return (
                        <>
                            <User
                                avatarProps={{
                                    size: "sm"
                                }}
                                description={row.original.fecha_devuelto}
                                name={row.original.nombre_usuario_devolvio}
                            />
                        </>
                    );
                },
            },
        ],
        [setReservasGlobales, reservasGlobales, reservasLinea, mostrarColumnasRecepcion]
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

    const devolver = async (row) => {

        if (!row.devuelta && (!row.motivo_no_devuelta || !row.comentarios_no_devuelta)) {
            toast.error('Por favor completa motivo y comentario en reservas no devueltas.');
            return false;
        }

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Retornar stock',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                const response = await odooApi.patch('/tms_travel/solicitudes_equipo/devolver/reserva/' + data?.id, row);
                if (response.data.status === 'success') {
                    toast.success(response.data.message);
                    fetchData(data?.id);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                if (error.response) {
                    toast.error("Error del servidor:" + error.response.data);
                } else {
                    console.error("Error de red:", error.message);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: reservasLinea,
        localization: MRT_Localization_ES,
        positionActionsColumn: "last",
        state: {
            columnVisibility: {
                devuelta: mostrarColumnasRecepcion,
                motivo_no_devuelta: mostrarColumnasRecepcion,
                comentarios_no_devuelta: mostrarColumnasRecepcion,
                recibido_operador: mostrarColumnasRecepcion,
                fecha_recibido_operador: mostrarColumnasRecepcion,
                observaciones_operador: mostrarColumnasRecepcion,
                fecha_devuelto: mostrarColumnasRecepcion,
            },
        },
        initialState: {
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
                {(data?.x_studio_estado === 'borrador' || data?.x_studio_estado === undefined) && (
                    <SearchUnidad data={dataLinea}></SearchUnidad>
                )}
                {(data?.x_studio_estado === 'entregado' || data?.x_studio_estado === 'recepcionado_operador') && (
                    <>
                        <Button color="primary" onPress={() => marcarTodas(true)} radius='full' isDisabled>
                            Marcar todas
                        </Button>
                        <Button color="danger" onPress={() => marcarTodas(false)} radius='full' isDisabled>
                            Desmarcar todas
                        </Button>
                    </>
                )}
            </>
        ),
        renderRowActions: ({ row }) => (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <>
                    {row.original.fecha_devuelto == null && (
                        <Button
                            isLoading={isLoading}
                            onPress={() => devolver(row.original)}
                            color="success"
                            size="sm"
                            className='text-white'
                            radius='full'
                            isDisabled={['borrador', 'confirmado'].includes(data?.x_studio_estado)}
                        >
                            Devolver
                        </Button>
                    )}
                </>
                <Button
                    onPress={() => deleteReserva(row.original.id_reserva)}
                    color="danger"
                    size="sm"
                    radius='full'
                    isDisabled={['confirmado', 'entregado', 'recepcionado_operador'].includes(data?.x_studio_estado)}
                >
                    Eliminar
                </Button>
            </Box >
        ),
        enableRowActions: true,
    });

    return (
        <Dialog open={open}
            onClose={handleClose}
            fullScreen
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                },
            }}>
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
