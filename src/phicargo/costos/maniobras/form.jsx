import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Card, CardBody } from "@heroui/react";
import { CardHeader, Chip, Divider, Input, User } from "@heroui/react";
import { Container, filledInputClasses } from '@mui/material';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import CostosExtrasContenedores from './añadir_contenedor/maniobra_contenedores';
import { CostosExtrasContext } from '../context/context';
import { DateRangePicker } from "@heroui/react";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import ManiobraContenedores from './añadir_contenedor/maniobra_contenedores';
import MonthSelector from '@/mes';
import { NumberInput } from "@heroui/react";
import ServiciosAplicadosCE from './costos_aplicados/costos_aplicados';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import YearSelector from '@/año';
import axios from 'axios';
import dayjs from 'dayjs';
import { getEstadoChip } from '../utils';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";

const FormCE = ({ }) => {

    const { id_folio, formData, setFormData, DisabledForm } = useContext(CostosExtrasContext);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [referencias, setReferencias] = useState([]);

    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const handleChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const handleChangeYear = (event) => {
        setSelectedYear(event.target.value);
    };

    useEffect(() => {
        if (!selectedMonth || !selectedYear) return;

        setLoading(true);
        odooApi.get("/folios_costos_extras/account_invoice/" + selectedMonth + '/' + selectedYear)
            .then((response) => {
                setReferencias(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener las referencias:", error);
                setLoading(false);
            });
    }, [selectedMonth, selectedYear]);

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
                Cell: ({ cell }) => {
                    const estado = cell.getValue();
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
                maxHeight: 'calc(100vh - 200px)',
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
                setFormData((prevData) => ({
                    ...prevData,
                    id_factura: row.original.id,
                    referencia_factura: row.original.move_name,
                }));
                handleClose();
            },
            style: {
                cursor: 'pointer',
            },
        }),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box display="flex" alignItems="center" m={2}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <MonthSelector
                        selectedMonth={selectedMonth}
                        handleChange={handleChange}
                    />
                </Box>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <YearSelector selectedYear={selectedYear} handleChange={handleChangeYear}></YearSelector>
                </Box>
            </Box>
        ),
    });

    const estado = formData.estado_factura ?? "";

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
                    <Button onPress={handleClickOpen} color="primary" isDisabled={DisabledForm}>
                        Buscar factura
                    </Button>
                </CardHeader>

                <Divider></Divider>
                <CardBody>
                    <Input
                        label="Referencia factura"
                        value={formData.referencia_factura ?? ""}
                        isDisabled={true}
                        variant={"underlined"}>
                    </Input>
                    <div className="flex justify-between mt-4">
                        <p>Fecha factura: {formData.fecha_factura ?? ""}</p>
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
