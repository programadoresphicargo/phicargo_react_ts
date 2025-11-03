import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from "@heroui/react";
import FormularioTerminales from './informacion';
import odooApi from '@/api/odoo-api';
import CustomNavbar from '@/pages/CustomNavbar';
import { pages } from '../../../maniobras/pages';

const Terminales = () => {

    const [open, setOpen] = useState(false);
    const [id_terminal, setIDTerminal] = useState(0);

    const handleClickOpen = (id_terminal) => {
        setOpen(true);
        setIDTerminal(id_terminal);
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
            const response = await odooApi.get('/maniobras/terminales/');
            setData(response.data);
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
                handleClickOpen(row.original.id_terminal);
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
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 250px)',
            },
        },
    });

    return (
        <div>
            <CustomNavbar pages={pages}></CustomNavbar>
            <div className="flex flex-wrap gap-2 items-center p-2">
                <Button color="primary" onPress={() => handleClickOpen(0)} radius='full'>
                    Nueva
                </Button>
            </div>
            <MaterialReactTable table={table} />
            <FormularioTerminales open={open} onClose={handleClose} id_terminal={id_terminal} />
        </div>
    );
};

export default Terminales;
