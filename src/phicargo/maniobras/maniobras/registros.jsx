import { Button, Card, CardBody } from "@heroui/react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { format, isValid } from 'date-fns';
import { Box } from '@mui/system';
import { Chip } from "@heroui/react";
import DocumentacionManiobra from '../documentacion/documentacion';
import Formulariomaniobra from './formulario_maniobra';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import odooApi from '@/api/odoo-api';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const Registromaniobras = ({ dataCP }) => {
    const [isLoading, setLoading] = useState();
    const [id_maniobra, setIDManiobra] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/maniobras/by_id_cp/' + dataCP?.id_cp);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    }, [dataCP?.id_cp]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleShowModal = () => {
        setModalShow(true);
    };

    const abrir_nueva = () => {
        setIDManiobra(null);
        handleShowModal(null);
    };

    const handleCloseModal = () => {
        setModalShow(false);
        fetchData();
        setIDManiobra(null);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id_maniobra',
                header: 'ID Maniobra',
            },
            {
                accessorKey: 'tipo_maniobra',
                header: 'Tipo maniobra',
            },
            {
                accessorKey: 'terminal',
                header: 'Terminal',
            },
            {
                accessorKey: 'vehiculo',
                header: 'Vehiculo',
            },
            {
                accessorKey: 'nombre_operador',
                header: 'Operador',
            },
            {
                accessorKey: 'inicio_programado',
                header: 'Inicio programado',
                size: 150,
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    const date = value ? new Date(value) : null;
                    const formattedDate = date && isValid(date) ? format(date, 'yyyy/MM/dd h:mm a') : 'Fecha no válida';

                    return <span>{formattedDate}</span>;
                },
            },
            {
                accessorKey: 'estado_maniobra',
                header: 'Estado maniobra',
                size: 150,
                Cell: ({ cell }) => {
                    const value = cell.getValue();

                    let variant = 'bg-secondary';
                    if (value === 'activa') {
                        variant = 'bg-success';
                    } else if (value === 'borrador') {
                        variant = 'bg-warning';
                    } else if (value === 'finalizada') {
                        variant = 'bg-primary';
                    } else {
                        variant = 'bg-danger';
                    }

                    return <Chip className={`badge ${variant} text-white`} size='sm'>{value}</Chip>;
                },
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        localization: MRT_Localization_ES,
        initialState: {
            showGlobalFilter: true,
            showColumnFilters: true,
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        state: { showProgressBars: isLoading },
        muiCircularProgressProps: {
            color: 'primary',
            thickness: 5,
            size: 45,
        },
        muiSkeletonProps: {
            animation: 'pulse',
            height: 28,
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                setIDManiobra(row.original.id_maniobra);
                handleShowModal(row.original.id_maniobra);
            },
            style: {
                cursor: 'pointer',
                backgroundColor: '#f5f5f5',
            },
        }), muiTableHeadCellProps: {
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
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button onPress={abrir_nueva} color="success" radius="full" className="text-white">
                    Nueva maniobra
                </Button>
            </Box>)
    });

    return (
        <>
            <Formulariomaniobra
                show={modalShow}
                handleClose={handleCloseModal}
                id_maniobra={id_maniobra}
                form_deshabilitado={true}
                dataCP={dataCP}
            />

            <Box sx={{ width: '100%' }}>
                <Card>
                    <CardBody>
                        <MaterialReactTable table={table} />
                    </CardBody>
                </Card>
            </Box>
        </>
    );
};

export default Registromaniobras;
