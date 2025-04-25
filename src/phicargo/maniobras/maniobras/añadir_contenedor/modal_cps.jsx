import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Box } from '@mui/material';
import { Button } from '@heroui/react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Select, SelectItem } from "@heroui/react";
import MonthSelector from '@/mes';
import YearSelector from '@/año';
import { ManiobraContext } from '../../context/viajeContext';
const { VITE_PHIDES_API_URL } = import.meta.env;

const AñadirContenedor = ({ show, handleClose, id_maniobra }) => {

    const [data, setData] = useState([]);
    const [isLoading2, setILoading] = useState();
    const { formData, setFormData } = useContext(ManiobraContext);

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
                setData(jsonData);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setILoading(false);
            }
        };

        fetchData(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    const añadir_contenedor = (data) => {
        setFormData(prev => {
            const yaExiste = prev.cps_ligadas?.some(item => item.id === data.id);
            if (yaExiste) {
                toast.warn('Este contenedor ya ha sido añadido.');
                return prev;
            }

            return {
                ...prev,
                cps_ligadas: [...(prev.cps_ligadas || []), data],
            };
        });
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'sucursal',
                header: 'Sucursal',
            },
            {
                accessorKey: 'carta_porte',
                header: 'Carta porte',
            },
            {
                accessorKey: 'cliente',
                header: 'Cliente',
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
            },
            {
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
            showColumnFilters: true
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
        muiTableBodyCellProps: {
            sx: {
                borderBottom: '1px solid #e0e0e0',
            },
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
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 385px)',
                boxShadow: 'none',
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            sx: {
                fontWeight: 'normal',
                fontSize: '24px',
                backgroundColor: row.getIsGrouped() ? '#246cd0' : 'inherit',
                color: 'white',
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

    return (
        <>
            <Dialog
                open={show}
                onClose={handleClose}
                fullWidth="xl"
                maxWidth="xl"
            >
                <DialogTitle id="example-custom-modal-styling-title">
                    Contenedores
                </DialogTitle>
                <DialogContent>
                    <MaterialReactTable table={table} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AñadirContenedor;