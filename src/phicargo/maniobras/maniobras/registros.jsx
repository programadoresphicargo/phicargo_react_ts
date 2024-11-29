import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Formulariomaniobra from './formulario_maniobra';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Button from '@mui/material/Button';
import { format, isValid } from 'date-fns';

const Registromaniobras = ({ id_cp, id_cliente }) => {
    const [isLoading2, setILoading] = useState();
    const [idManiobra, setIdManiobra] = useState();
    const [idCliente, setClienteID] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [data, setData] = useState([]); // Estado para almacenar los datos

    const fetchData = useCallback(async () => {
        try {
            setILoading(true);
            const response = await fetch('/phicargo/modulo_maniobras/maniobra/registros.php?id_cp=' + id_cp);
            const jsonData = await response.json();
            setData(jsonData);
            setILoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }, [id_cp]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleShowModal = () => {
        setModalShow(true);
    };

    const abrir_nueva = () => {
        setIdManiobra(null);
        handleShowModal(null);
    };

    const handleCloseModal = () => {
        setModalShow(false);
        fetchData();
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

                    return <span className={`badge ${variant}`}>{value}</span>;
                },
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
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
        state: { isLoading: isLoading2 },
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
                setIdManiobra(row.original.id_maniobra);
                handleShowModal(row.original.id_maniobra);
                setClienteID(id_cliente);
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
    });

    return (
        <div>
            <div className="flex flex-wrap gap-2 items-center">
                <Button onClick={abrir_nueva} variant="contained">
                    Ingresar maniobra
                </Button>
            </div>
            <Formulariomaniobra
                show={modalShow}
                handleClose={handleCloseModal}
                id_maniobra={idManiobra}
                id_cp={id_cp}
                form_deshabilitado={true}
                id_cliente={id_cliente}
            />
            <MaterialReactTable table={table} />
        </div>
    );
};

export default Registromaniobras;
