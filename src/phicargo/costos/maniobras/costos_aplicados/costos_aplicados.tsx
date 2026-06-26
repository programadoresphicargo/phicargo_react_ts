import { Card, CardBody } from "@heroui/react";
import {
    MRT_ColumnDef,
    MRT_Row,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import { useCostosExtras } from '../../context/context';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import ServiciosExtras from './tipos_costos_extras';
import Swal from 'sweetalert2';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayUpdate } from "react-hook-form";
import { CostoExtraAplicado, FolioCostoExtra } from "../../folios/tabla";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

type Props = {
    fields: FieldArrayWithId<FolioCostoExtra, "costos_extras", "fieldId">[];
    append: UseFieldArrayAppend<FolioCostoExtra, "costos_extras">;
    remove: UseFieldArrayRemove;
    update: UseFieldArrayUpdate<FolioCostoExtra, "costos_extras">;
};

const ServiciosAplicadosCE = ({ fields, append, remove, update }: Props) => {

    const { DisabledForm } = useCostosExtras();

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const removeRow = (rowIndex: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el registro.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                remove(rowIndex);
                toast.success('Registro eliminado correctamente');
            }
        });
    };

    const columns = useMemo<MRT_ColumnDef<CostoExtraAplicado>[]>(
        () => [
            {
                accessorKey: 'id_tipo_costo',
                header: 'Clave costo',
                enableEditing: false,
            },
            {
                accessorKey: 'descripcion',
                header: 'Descripción',
                enableEditing: false,
                size: 1,
            },
            {
                accessorKey: 'costo',
                header: 'Costo',
                enableEditing: true,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
            },
            {
                accessorKey: 'cantidad',
                header: 'Cantidad',
                enableEditing: true,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
            },
            {
                accessorKey: "iva",
                header: "IVA",
                enableEditing: true,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({ row }) => {
                    const iva = row.original.iva ?? 0.16;
                    return iva.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
            },
            {
                accessorKey: "retencion",
                header: "Retención",
                enableEditing: false,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({ row }) => {
                    const costo = row.original.costo || 0;
                    const cantidad = row.original.cantidad || 1;
                    const retencion = row.original.id_tipo_costo === 1 ? (costo * cantidad) * 0.04 : 0;
                    row.original.retencion = retencion;

                    return row.original.retencion.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
            },
            {
                accessorKey: "subtotal",
                header: "Subtotal",
                enableEditing: false,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({ row }) => {
                    const costo = row.original.costo || 0;
                    const cantidad = row.original.cantidad || 1;
                    const retencion = row.original.id_tipo_costo === 1 ? (costo * cantidad) * 0.04 : 0;

                    const subtotal = (costo * cantidad) - retencion;
                    return subtotal.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
            },
            {
                accessorKey: "total",
                header: "Total",
                enableEditing: false,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({ row }) => {
                    const costo = row.original.costo || 0;
                    const cantidad = row.original.cantidad || 1;
                    const iva = row.original.iva ?? 0.16;
                    const retencion = row.original.id_tipo_costo === 1 ? (costo * cantidad) * 0.04 : 0;

                    const subtotal = (costo * cantidad) * (1 + iva) - retencion;
                    return subtotal.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
            },
            {
                accessorKey: "ajuste_cobro",
                header: "Ajuste",
                enableEditing: true,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({ row }: { row: MRT_Row<CostoExtraAplicado> }) => {
                    // Si ajuste_cobro es null o undefined, tomar el valor de subtotal
                    const subtotal = (() => {
                        const costo = row.original.costo || 0;
                        const cantidad = row.original.cantidad || 1;
                        const iva = row.original.iva ?? 0.16;
                        const retencion = row.original.id_tipo_costo === 1 ? (costo * cantidad) * 0.04 : 0;
                        return (costo * cantidad) * (1 + iva) - retencion;
                    })();

                    row.original.ajuste_cobro = row.original.ajuste_cobro ?? subtotal;

                    return row.original.ajuste_cobro.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
                muiTableBodyCellEditTextFieldProps: ({ row }: { row: MRT_Row<CostoExtraAplicado> }) => ({
                    type: "number",
                    onBlur: (event: any) => {
                        const value = Number(event.target.value) || 0;

                        update(row.index, {
                            ...row.original,
                            ajuste_cobro: value,
                        });
                    },
                })
            },
            {
                accessorKey: 'comentarios',
                header: 'Comentarios',
                enableEditing: true,
            },
        ],
        []
    );

    const totalSubtotal = useMemo(() => {
        return fields.reduce((total, item) => {
            const costo = item.costo || 0;
            const cantidad = item.cantidad || 1;
            const iva = item.iva ?? 0.16;
            const retencion = item.id_tipo_costo === 1 ? (costo * cantidad) * -0.04 : 0;

            const subtotal = (costo * cantidad) * (1 + iva) + retencion;
            return total + subtotal;
        }, 0).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }, [fields]);


    const table = useMaterialReactTable<CostoExtraAplicado>({
        columns,
        data: fields,
        enableEditing: true,
        editDisplayMode: 'modal',
        localization: MRT_Localization_ES,
        positionActionsColumn: 'last',
        initialState: {
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
        },
        onEditingRowSave: ({ row, values, exitEditingMode }) => {

            const updatedRow = {
                ...row.original,
                ...values,
            };

            updatedRow.costo = Number(updatedRow.costo) || 0;
            updatedRow.cantidad = Number(updatedRow.cantidad) || 1;

            update(row.index, updatedRow);

            exitEditingMode();
            toast.success('Registro actualizado');

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
                fontSize: '12px',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '12px',
            },
        },
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <h1
                    className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
                >
                    Costos extras
                </h1>
                <Button radius="full" onPress={handleClickOpen} color="primary" size="sm" isDisabled={DisabledForm} startContent={<i className="bi bi-plus-lg"></i>}>
                    Añadir costo extra
                </Button>
            </Box>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '8px' }}>
                <Button
                    color="primary"
                    size="sm"
                    className='text-white'
                    isDisabled={DisabledForm}
                    onPress={() => table.setEditingRow(row)}
                    radius="full"
                >
                    Editar
                </Button>
                <Button
                    color="danger"
                    size="sm"
                    radius="full"
                    isDisabled={DisabledForm}
                    onPress={() => removeRow(row.index)}
                >
                    Eliminar
                </Button>
            </Box>
        ),
        renderBottomToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '8px',
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: '#f9f9f9',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total: ${totalSubtotal}
                </Typography>
            </Box>
        ),
    });

    return (
        <>
            <Card>
                <CardBody>
                    <MaterialReactTable table={table} />
                </CardBody>
            </Card>

            <Dialog
                fullScreen
                maxWidth="lg"
                scroll='body'
                open={open}
                onClose={handleClose}
            >
                <AppBar sx={{ position: 'relative' }} elevation={0}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Costos extras
                        </Typography>
                        <Button autoFocus onPress={handleClose}>
                            Cerrar
                        </Button>
                    </Toolbar>
                </AppBar>
                <ServiciosExtras onClose={handleClose} append={append} />
            </Dialog>
        </>
    );
};

export default ServiciosAplicadosCE;

