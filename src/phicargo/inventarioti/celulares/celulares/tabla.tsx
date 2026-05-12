import { Button, Chip } from '@heroui/react';
import {
    MRT_Row,
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
import { exportToCSV } from '../../../utils/export';

type Celular = { id_celular: number }

type Props = {
    active: boolean;
};

const CelularesTabla: React.FC<Props> = ({
    active
}) => {

    const [isLoading, setLoading] = useState(false);
    const [id_celular, setCelular] = useState<number | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [data, setData] = useState<Celular[]>([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/inventarioti/dispositivos/celular/' + active);
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
            { accessorKey: 'empresa', header: 'Empresa' },
            { accessorKey: 'imei', header: 'IMEI' },
            { accessorKey: 'marca', header: 'Marca' },
            { accessorKey: 'modelo', header: 'Modelo' },
            { accessorKey: 'correo', header: 'Correo' },
            { accessorKey: 'passwoord', header: 'Contraseña' },
            {
                accessorKey: 'estado', header: 'Estado',
                Cell: ({ row }: { row: MRT_Row<any> }) => (
                    <Chip
                        className='text-white'
                        color={row.original.estado == 'disponible' ? 'success' : 'primary'}
                        variant="solid"
                        size='sm'
                    >
                        {row.original.estado}
                    </Chip >
                ),
            },
            { accessorKey: 'fecha_baja', header: 'Fecha baja' },
            { accessorKey: 'motivo_baja', header: 'Motivo baja' },
            { accessorKey: 'comentarios_baja', header: 'Comentarios baja' },
            { accessorKey: 'nombre_empleado_baja', header: 'Empleado baja' },
        ],
        [active],
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
            columnVisibility: {
                motivo_baja: active ? false : true,
                comentarios_baja: active ? false : true,
                fecha_baja: active ? false : true,
                nombre_empleado_baja: active ? false : true,
            },
        },
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
            showColumnFilters: true,
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                setCelular(row.original.id_celular);
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
                    Celulares
                </h1>
                <Button
                    radius='full'
                    color="primary"
                    onPress={() => {
                        onOpen();
                        setCelular(null);
                    }}><i className="bi bi-plus-circle"></i>Nuevo</Button>

                <Button
                    radius='full'
                    color="danger"
                    onPress={() => {
                        fetchData();
                    }}><i className="bi bi-arrow-clockwise"></i>Refrescar
                </Button>

                <Button
                    radius='full'
                    color='success'
                    className='text-white'
                    startContent={<i className="bi bi-file-earmark-excel"></i>}
                    onPress={() => exportToCSV(data, columns, "celulares.csv")}>
                    Exportar
                </Button>
            </Box >
        ),
    });

    return (
        <>
            <MaterialReactTable table={table} />
            <FormCelulares
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                id_celular={id_celular} />
        </>
    );
};

export default CelularesTabla;

