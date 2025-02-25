import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { getLocalTimeZone, parseDate } from "@internationalized/date";

import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import { CostosExtrasContext } from '../../context/context';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { toast } from 'react-toastify';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { DateRangePicker } from 'rsuite';
import MonthSelector from '@/mes';
import YearSelector from '@/año';
const { VITE_PHIDES_API_URL } = import.meta.env;

const AñadirContenedor = ({ show, handleClose }) => {

    const { id_folio, CartasPorte, setCPS } = useContext(CostosExtrasContext);

    const [data, setData] = useState([]);
    const [isLoading2, setILoading] = useState();

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
        const fetchData = async (month, year,) => {
            if (!selectedMonth || !selectedYear) return;

            try {
                setILoading(true);
                const response = await fetch(VITE_PHIDES_API_URL + '/modulo_maniobras/programacion/get_registros2.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ month, year }),
                });

                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }

                const jsonData = await response.json();
                setData(jsonData); // Actualiza el estado con los datos obtenidos
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setILoading(false); // Asegúrate de que setILoading se ejecute siempre
            }
        };

        fetchData(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    const añadir_contenedor = (data) => {
        setCPS(prevCartasPorte => [...prevCartasPorte, data]);
        handleClose();
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Carta porte',
            },
            {
                accessorKey: 'x_ejecutivo_viaje_bel',
                header: 'Ejecutivo de viaje',
                size: 150,
            },
            {
                accessorKey: 'x_reference',
                header: 'Contenedor',
                size: 150,
            }, {
                accessorKey: 'date_order',
                header: 'Fecha',
                size: 150,
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        elevation: 0,
        enableGrouping: true,
        enableGlobalFilter: false,
        enableFilters: true,
        state: {
            isLoading: isLoading2,
            showColumnFilters: true,
            showProgressBars: isLoading2
        },
        muiCircularProgressProps: {
            color: 'primary',
            thickness: 5,
            size: 45,
        },
        muiSkeletonProps: {
            animation: 'pulse',
            height: 28,
        },
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        enableRowActions: true,
        displayColumnDefOptions: {
            'mrt-row-actions': {
                header: 'Seleccionar',
                size: 100,
            },
        },
        renderRowActions: ({ row }) => (
            <Box>
                <Button color='primary' onPress={() => añadir_contenedor(row.original)} size='sm'>
                    Añadir
                </Button>
            </Box>
        ),
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 385px)',
                boxShadow: 'none',
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
                backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '14px',
                color: row.subRows?.length ? '#FFFFFF' : '#000000',
                borderBottom: '1px solid #e0e0e0'
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

    return (
        <>
            <Dialog
                open={show}
                onClose={handleClose}
                fullWidth={true}
                maxWidth='lg'
            >
                <DialogTitle id="example-custom-modal-styling-title">
                    Cartas porte
                </DialogTitle>
                <DialogContent>
                    <MaterialReactTable table={table} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AñadirContenedor;