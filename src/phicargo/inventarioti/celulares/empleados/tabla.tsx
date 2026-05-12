import { Button } from '@heroui/react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import FormCelulares from './form';
import {
    useDisclosure,
} from "@heroui/react";
import { exportToCSV } from '@/phicargo/utils/export';

type Empleado = { id_empleado: number }

type Props = {
    active: boolean;
};

const EmpleadosTI: React.FC<Props> = ({
    active
}) => {

    const [isLoading, setLoading] = useState(false);
    const [id_empleado, setEmpleado] = useState<number | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [data, setData] = useState<Empleado[]>([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/inventarioti/empleados/activo/' + active);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isOpen]);

    const columns = useMemo(
        () => [
            { accessorKey: 'id_empleado', header: 'ID Empleado' },
            { accessorKey: 'departamento', header: 'Departamento' },
            { accessorKey: 'puesto', header: 'Puesto' },
            { accessorKey: 'nombre_empleado', header: 'Nombre empleado' },
            { accessorKey: 'tiene_celular', header: 'Celular asignado' },
            { accessorKey: 'tiene_computo', header: 'Computo asignado' },
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
        state: { showProgressBars: isLoading },
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
            showColumnFilters: true,
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                setEmpleado(row.original.id_empleado);
                onOpen();
            },
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
                <h1
                    className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
                >
                    Empleados
                </h1>
                <Button
                    radius='full'
                    color="primary"
                    onPress={() => {
                        onOpen();
                        setEmpleado(null);
                    }}>Nuevo</Button>

                <Button
                    radius='full'
                    color="danger"
                    onPress={() => {
                        fetchData();
                    }}>Refrescar
                </Button>

                <Button
                    radius='full'
                    color='success'
                    className='text-white'
                    startContent={<i className="bi bi-file-earmark-excel"></i>}
                    onPress={() => exportToCSV(data, columns, "empleados.csv")}>
                    Exportar
                </Button>

            </Box >
        ),
    });

    return (
        <>
            <MaterialReactTable table={table} />
            <FormCelulares isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} id_celular={id_empleado}></FormCelulares>
        </>
    );
};

export default EmpleadosTI;

