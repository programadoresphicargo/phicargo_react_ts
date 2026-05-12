import odooApi from "@/api/odoo-api";
import {
    Button
} from "@heroui/react";
import Box from '@mui/material/Box';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

type Empleado = {
    tiene_celular: string,
    tiene_computo: string
}

export default function DispositivosSinAsignar({ tipo }: { tipo: string }) {

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState<Empleado[]>([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get<Empleado[]>('/inventarioti/empleados/activo/true');
            if (tipo == 'celular') {
                const filtrados = response.data.filter(item => item.tiene_celular === 'No');
                setData(filtrados);
            } else {
                const filtrados = response.data.filter(item => item.tiene_computo === 'No');
                setData(filtrados);
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            { accessorKey: 'nombre_empleado', header: 'Nombre empleado' },
            { accessorKey: 'puesto', header: 'Puesto' },
            { accessorKey: 'tiene_celular', header: 'Tiene celular' },
            { accessorKey: 'tiene_computo', header: 'Tiene computo' },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        localization: MRT_Localization_ES,
        state: {
            showProgressBars: isLoading,
        },
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
            showColumnFilters: true,
            columnVisibility:
            {
                tiene_celular: tipo == 'celular' ? true : false,
                tiene_computo: tipo == 'computo' ? true : false,
            }
        },
        muiTableBodyRowProps: () => ({
            style: {
                cursor: 'pointer',
            },
        }),
        muiTableHeadCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'Bold',
                fontSize: '14px',
            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
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
                maxHeight: 'calc(100vh - 260px)',
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
                <Button
                    color="danger"
                    radius="full"
                    onPress={() => {
                        fetchData();
                    }}>Refrescar
                </Button>
            </Box >
        ),
    });

    return (
        <>
            <MaterialReactTable table={table} />
        </>
    );
}
