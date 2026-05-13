import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from "@heroui/react";
import FormularioTerminales from './form';
import odooApi from '@/api/odoo-api';
import CustomNavbar from '@/pages/CustomNavbar';
import { pages } from '../../pages';
import Box from '@mui/material/Box';
import { Terminal } from './type';

const Terminales = () => {

    const [open, setOpen] = useState(false);
    const [id_terminal, setIDTerminal] = useState<number | null>(null);

    const handleClickOpen = (id_terminal: number | null) => {
        setOpen(true);
        setIDTerminal(id_terminal);
    };

    const handleClose = () => {
        setOpen(false);
        fetchData();
    };

    const [isLoading, setILoading] = useState(false);
    const [data, setData] = useState<Terminal[]>([]);

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
    }, []);

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
            {
                accessorKey: 'fecha_creacion',
                header: 'Fecha creaciòn',
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
            pagination: { pageIndex: 0, pageSize: 80 },
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
                maxHeight: 'calc(100vh - 200px)',
            },
        },
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
                    Terminales
                </h1>
                <Button color="primary" onPress={() => handleClickOpen(null)} radius='full'>
                    Nueva
                </Button>
            </Box>
        ),
    });

    return (
        <>
            <CustomNavbar pages={pages}></CustomNavbar>
            <MaterialReactTable table={table} />
            <FormularioTerminales open={open} onClose={handleClose} id_terminal={id_terminal} />
        </>
    );
};

export default Terminales;
