import { Autocomplete, AutocompleteItem, button } from "@heroui/react";
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { useAlmacen } from "../../contexto/contexto";
import toast from 'react-hot-toast';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import { Button } from "@heroui/react";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SearchUnidad = ({ data, open, handleClose }) => {
    const { reservasGlobales, setReservasGlobales } = useAlmacen();
    const [options, setOptions] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [rowSelection, setRowSelection] = useState({});

    const agregarSeleccionados = () => {
        const selectedRows = table.getSelectedRowModel().rows;

        if (!selectedRows.length) {
            toast.error("Selecciona al menos una unidad.");
            return;
        }

        const nuevasReservas = [];

        for (const row of selectedRows) {
            const item = row.original;
            const idNum = item.key;

            const reservasLinea = reservasGlobales.filter(
                (r) => r.id_solicitud_equipo_line === data.id
            );

            // 🔐 validar duplicados globales
            const yaExiste = reservasGlobales.some((r) => r.id_unidad === idNum);
            if (yaExiste) {
                toast.error(`La unidad ${item.label} ${item.key} ya fue seleccionada.`);
                continue;
            }

            // 🔐 validar límite por línea
            if (reservasLinea.length + nuevasReservas.length >= data.x_cantidad_solicitada) {
                toast.error("Excedes el número permitido para esta línea.");
                break;
            }

            let contador = 0;

            for (const row of selectedRows) {
                const item = row.original;
                const idNum = item.key;

                const idUnico = -(Date.now() + contador++);

                nuevasReservas.push({
                    id_reserva: idUnico,
                    id_solicitud_equipo_line: data.id,
                    id_unidad: idNum,
                    x_name: item.label,
                });
            }
            handleClose();
        }

        if (nuevasReservas.length) {
            setReservasGlobales((prev) => [...prev, ...nuevasReservas]);

            // eliminar de la tabla
            // const idsSeleccionados = nuevasReservas.map((r) => r.id_unidad);
            // setOptions((prev) => prev.filter((item) => !idsSeleccionados.includes(item.key)));

            // limpiar selección
            setRowSelection({});
        }
    };

    useEffect(() => {
        if (!data?.x_producto_id) return;

        setLoading(true);
        setOptions([]); // Reset previo
        odooApi.get(`/tms_travel/unidades_equipo/producto_estado/${data.x_producto_id}/disponible`)
            .then(response => {
                const opciones = response.data.map(item => ({
                    key: Number(item.id_unidad),
                    label: item.x_name,
                }));
                setOptions(opciones);
            })
            .catch(() => {
                toast.error("Error al obtener unidades disponibles.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [data?.x_producto_id, data]);

    const columns = useMemo(
        () => [
            { accessorKey: 'key', header: 'ID Unidad' },
            { accessorKey: 'label', header: 'Descripción' },
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: options,
        localization: MRT_Localization_ES,
        positionActionsColumn: "last",
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
            showProgressBars: isLoading
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
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 250px)',
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
                <Button color="success" onPress={agregarSeleccionados} className="text-white" radius="full">
                    Agregar seleccionados
                </Button>
            </>
        ),
    });

    return (
        <>
            <Dialog
                maxWidth="lg"
                fullWidth
                open={open}
                onClose={handleClose}
                slots={{
                    transition: Transition,
                }}
            >
                <AppBar sx={{ position: 'relative', background: 'linear-gradient(90deg, #15ca63 0%, #15ca63 100%)' }} elevation={0}>
                    <Toolbar>
                        <Button
                            variant="flat"
                            onPress={handleClose}
                            radius="full"
                            className="text-white"
                        >
                            <CloseIcon />
                        </Button>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Equipo disponible
                        </Typography>
                        <Button autoFocus color="inherit" onPress={handleClose}>
                            Cerrar
                        </Button>
                    </Toolbar>
                </AppBar>

                <MaterialReactTable table={table} />

            </Dialog>
        </>
    );
};

export default SearchUnidad;
