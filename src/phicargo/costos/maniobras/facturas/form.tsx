import { Card, CardBody, RangeValue } from "@heroui/react";
import { CardHeader, Chip, Divider, Input } from "@heroui/react";
import {
    MRT_Cell,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { getEstadoChip } from '../../utils';
import odooApi from '@/api/odoo-api';
import { DateRangePicker } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useCostosExtras } from "../../context/context";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FolioCostoExtra } from "../../folios/tabla";

type Facturas = {
    id: number,
    move_name: string;
}

type Props = {
    watch: UseFormWatch<FolioCostoExtra>;
    setValue: UseFormSetValue<FolioCostoExtra>;
};

const FormCE = ({ watch, setValue }: Props) => {

    function formatDateToYYYYMMDD(date: Date): string {
        return date.toISOString().slice(0, 10);
    }

    const now = new Date();
    const first = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth(), 1));
    const last = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth() + 1, 0));

    const [value, setValue2] = React.useState<
        RangeValue<CalendarDate> | null
    >({
        start: parseDate(first),
        end: parseDate(last),
    });

    const { DisabledForm } = useCostosExtras();
    const [open, setOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [referencias, setReferencias] = useState<Facturas[]>([]);


    useEffect(() => {
        if (!value) return;
        setLoading(true);
        odooApi.get("/folios_costos_extras/account_invoice/", {
            params: {
                date_start: value.start,
                date_end: value.end
            }
        })
            .then((response) => {
                setReferencias(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener las referencias:", error);
                setLoading(false);
            });
    }, [value]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'move_name',
                header: 'Referencia',
            },
            {
                accessorKey: 'date_invoice',
                header: 'Fecha factura',
            },
            {
                accessorKey: 'state',
                header: 'Estado',
                Cell: ({ cell }: { cell: MRT_Cell<Facturas> }) => {

                    const estado = cell.getValue<string>();
                    const { color, text } = getEstadoChip(estado);

                    return (
                        <Chip color={color} size='sm' className="text-white">
                            {text}
                        </Chip>
                    );
                },
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: referencias,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        state: { isLoading: isLoading },
        enableColumnPinning: true,
        localization: MRT_Localization_ES,
        enableStickyHeader: true,
        columnResizeMode: "onEnd",
        initialState: {
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
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
                maxHeight: 'calc(100vh - 200px)',
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                setValue("id_factura", row.original.id);
                setValue("referencia_factura", row.original.move_name);
                handleClose();
            },
            style: {
                cursor: 'pointer',
            },
        }),
        renderTopToolbarCustomActions: () => (
            <Box display="flex" alignItems="center" m={2}>
                <DateRangePicker
                    visibleMonths={2}
                    value={value}
                    onChange={setValue2}
                    className="max-w-xs"
                    label="Cartas porte"
                />
            </Box>
        ),
    });

    const estado = watch("estado_factura");
    const referencia_factura = watch("referencia_factura");
    const fecha_factura = watch("fecha_factura");

    const { color, text } = getEstadoChip(estado);

    return (
        <>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h1
                        className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
                    >
                        Factura
                    </h1>
                    <Button onPress={handleClickOpen} color="primary" isDisabled={DisabledForm} radius="full">
                        Buscar factura
                    </Button>
                </CardHeader>

                <Divider></Divider>
                <CardBody>
                    <Input
                        label="Referencia factura"
                        value={referencia_factura ?? ""}
                        isDisabled={true}
                        variant={"underlined"}>
                    </Input>
                    <div className="flex justify-between mt-4">
                        <p>Fecha factura: {fecha_factura ?? ""}</p>
                        <Chip color={color} variant="flat">
                            {text}
                        </Chip>
                    </div>
                </CardBody>
            </Card>

            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={"lg"}
                scroll='body'
                onClose={handleClose}
            >
                <DialogTitle>Facturas</DialogTitle>
                <DialogContent>
                    <MaterialReactTable table={table} />
                </DialogContent>
                <DialogActions>
                    <Button onPress={handleClose}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FormCE;
