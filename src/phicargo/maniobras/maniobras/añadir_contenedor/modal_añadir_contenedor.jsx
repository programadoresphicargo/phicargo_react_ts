import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { toast } from 'react-toastify';


const months = [
    { value: '01', name: 'Enero' },
    { value: '02', name: 'Febrero' },
    { value: '03', name: 'Marzo' },
    { value: '04', name: 'Abril' },
    { value: '05', name: 'Mayo' },
    { value: '06', name: 'Junio' },
    { value: '07', name: 'Julio' },
    { value: '08', name: 'Agosto' },
    { value: '09', name: 'Septiembre' },
    { value: '10', name: 'Octubre' },
    { value: '11', name: 'Noviembre' },
    { value: '12', name: 'Diciembre' }
];

const AñadirContenedor = ({ show, handleClose, id_maniobra }) => {

    const [data, setData] = useState([]); // Estado para almacenar los datos
    const [isLoading2, setILoading] = useState();
    const currentMonth = new Date().toLocaleDateString('es-MX', { month: '2-digit' });
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        setSelectedMonth(currentMonth);
    }, [currentMonth]);

    const handleChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedMonth) return;

            try {
                setILoading(true);
                const response = await fetch('/phicargo/modulo_maniobras/programacion/get_registros2.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ month: selectedMonth }), // Convertir el objeto a una cadena JSON
                });

                const jsonData = await response.json();
                setData(jsonData); // Actualiza el estado con los datos obtenidos
                setILoading(false);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, [selectedMonth]);

    const añadir_contenedor = (id_cp) => {
        axios.post('/phicargo/modulo_maniobras/maniobra/añadir_contenedor.php?id_maniobra=' + id_maniobra + '&id_cp=' + id_cp,)
            .then((response) => {
                const data = response.data;
                if (data.success) {
                    toast.success('Contenedor añadido correctamente');
                    handleClose();
                } else {
                    toast.error('Respuesta inesperada del servidor:' + data.error);
                }
            })
            .catch((error) => {
                console.error('Error en la solicitud:', error);
                if (error.response) {
                    toast.error('Respuesta de error del servidor:' + error.response.status);
                } else if (error.request) {
                    toast.error('Respuesta de error del servidor:' + error.request);
                } else {
                    toast.error('Error al configurar la solicitud:' + error.message);
                }
            });
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'store_id',
                header: 'Sucursal',
                Cell: ({ cell }) => {
                    const partnerData = cell.getValue();
                    return partnerData[1];
                }
            },
            {
                accessorKey: 'name',
                header: 'Carta porte',
            },
            {
                accessorKey: 'partner_id',
                header: 'Cliente',
                Cell: ({ cell }) => {
                    const partnerData = cell.getValue();
                    return partnerData[1];
                }
            }, {
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
                borderBottom: '1px solid #e0e0e0', // Añade un borde entre columnas
            },
        },
        enableRowActions: true,
        displayColumnDefOptions: {
            'mrt-row-actions': {
                header: 'Seleccionar', //change header text
                size: 100, //make actions column wider
            },
        },
        renderRowActions: ({ row }) => (
            <Box>
                <Button variant="contained" onClick={() => añadir_contenedor(row.original.id)}>
                    Añadir
                </Button>
            </Box>
        ),
        muiTableBodyRowProps: ({ row }) => ({
            sx: {
                fontWeight: 'normal',
                fontSize: '24px',
                backgroundColor: row.getIsGrouped() ? '#246cd0' : 'inherit',
                color: 'white', // Corrige el color a 'white'
            },
            style: {
                cursor: 'pointer', // Cambia el cursor al pasar sobre la fila
            },
        }),
        muiTableContainerProps: {
            sx: {
                boxShadow: 'none', // Quita la sombra alrededor de la tabla
            },
        },
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
                    <select value={selectedMonth} onChange={handleChange} className="form-control">
                        <option value="" disabled>Selecciona un mes</option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                    </select>
                    <MaterialReactTable table={table} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AñadirContenedor;