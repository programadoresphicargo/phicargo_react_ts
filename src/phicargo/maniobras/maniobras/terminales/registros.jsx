import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Button from '@mui/material/Button';
import FormularioTerminales from './informacion';
import ManiobrasNavBar from '../../Navbar';
const { VITE_PHIDES_API_URL } = import.meta.env;

const Terminales = () => {

    const [open, setOpen] = useState(false);
    const [id_terminal, setIDTerminal] = useState(0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        fetchData();
    };

    const [isLoading2, setILoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            setILoading(true);
            const response = await fetch(VITE_PHIDES_API_URL + '/modulo_maniobras/terminales/getTerminales.php');
            const jsonData = await response.json();
            setData(jsonData);
            setILoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setILoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id_terminal',
                header: 'ID Terminal',
            },
            {
                accessorKey: 'terminal',
                header: 'Terminal',
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
                handleClickOpen();
                setIDTerminal(row.original.id_terminal);
            },
            style: {
                cursor: 'pointer',
                backgroundColor: '#f5f5f5',
            },
        }),
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
    });

    return (
        <div>
            <ManiobrasNavBar />
            <div className="flex flex-wrap gap-2 items-center p-2">
                <Button variant="contained" onClick={handleClickOpen}>
                    Ingresar terminal
                </Button>
            </div>
            <MaterialReactTable table={table} />
            <FormularioTerminales open={open} onClose={handleClose} id_terminal={id_terminal} />
        </div>
    );
};

export default Terminales;
