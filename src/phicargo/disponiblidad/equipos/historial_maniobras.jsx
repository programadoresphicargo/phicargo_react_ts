import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
} from '@mui/material';
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import { Chip } from "@heroui/react";
import Formulariomaniobra from '@/phicargo/maniobras/maniobras/formulario_maniobra';
import ManiobrasNavBar from '../../maniobras/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import customFontTheme from '../../../theme';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

const HistorialManiobrasVehiculo = ({ vehicle_id }) => {
    const [isLoading2, setLoading] = useState();
    const [data, setData] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [id_maniobra, setIdmaniobra] = useState('');
    const [id_cp, setIdcp] = useState('');
    const [idCliente, setClienteID] = useState('');

    const handleShowModal = (id_maniobra, id_cp) => {
        setModalShow(true);
        setIdmaniobra(id_maniobra);
        setIdcp(id_cp);
    };

    const handleCloseModal = () => {
        setModalShow(false);
        fetchData();
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/maniobras/historial_vehicular/' + vehicle_id);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id_maniobra',
                header: 'ID Maniobra',
            },
            {
                accessorKey: 'sucursal',
                header: 'Sucursal',
            },
            {
                accessorKey: 'inicio_programado',
                header: 'Inicio programado',
                size: 150,
                Cell: ({ cell }) => {
                    const rawDate = cell.getValue();
                    const date = new Date(rawDate);

                    if (isNaN(date.getTime())) {
                        return "Fecha no válida";
                    }

                    const options = {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                    };

                    const formattedDate = date.toLocaleString('es-ES', options);
                    return formattedDate;
                },
            },
            {
                accessorKey: 'tipo_maniobra',
                header: 'Tipo de maniobra',
                Cell: ({ cell }) => {
                    const value = cell.getValue();

                    let variant = 'secondary';
                    if (value === 'retiro') {
                        variant = 'success';
                    } else if (value === 'ingreso') {
                        variant = 'primary';
                    } else if (value === 'local') {
                        variant = 'danger';
                    }

                    return (
                        <Chip className={`badge bg-${variant} rounded-pill text-white`} size='sm'>
                            {value}
                        </Chip>
                    );
                },

            },
            {
                accessorKey: 'terminal',
                header: 'Terminal',
            },
            {
                accessorKey: 'unidad',
                header: 'Unidad',
            },
            {
                accessorKey: 'nombre_operador',
                header: 'Operador',
                size: 150,
            },
            {
                accessorKey: 'fecha_activacion',
                header: 'Fecha de inicio',
                size: 150,
            },
            {
                accessorKey: 'fecha_finalizada',
                header: 'Fecha finalizada',
                size: 150,
            },
            {
                accessorKey: 'x_ejecutivo_viaje_bel',
                header: 'Ejecutivo',
                size: 150,
            },
            {
                accessorKey: 'ultimo_estatus',
                header: 'Ultimo estatus enviado',
                size: 150,
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    return (
                        <Chip className={`badge bg-success rounded-pill text-white`} style={{ width: '120px' }}>
                            {value}
                        </Chip>
                    );
                },
            },
            {
                accessorKey: 'cartas_porte',
                header: 'Cartas porte',
                size: 150,
            },
            {
                accessorKey: 'contenedores_ids',
                header: 'Contenedor',
                size: 150,
            },
            {
                accessorKey: 'nombre_cliente',
                header: 'Cliente',
                size: 150,
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        state: { isLoading: isLoading2 },
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
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
                if (row.subRows?.length) {
                } else {
                    handleShowModal(row.original.id_maniobra, row.original.id);
                    setClienteID(row.original.id_cliente);
                }
            },
            style: {
                cursor: 'pointer',
            },
        }),
    });

    return (<>
        <MaterialReactTable table={table} />

        <Formulariomaniobra
            show={modalShow}
            handleClose={handleCloseModal}
            id_maniobra={id_maniobra}
            id_cp={id_cp}
            id_cliente={idCliente}
            form_deshabilitado={true}
        />
    </>
    );
};

export default HistorialManiobrasVehiculo;
