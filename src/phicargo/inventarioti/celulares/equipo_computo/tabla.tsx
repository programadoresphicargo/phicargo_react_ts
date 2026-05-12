import { Button, Chip } from '@heroui/react';
import {
    MRT_Cell,
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

const EquipoTI = ({ active }: { active: boolean }) => {

    const [isLoading, setLoading] = useState(false);
    const [id_equipo, setEquipo] = useState<number | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/inventarioti/dispositivos/computo/' + active);
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
            { accessorKey: 'id_ec', header: 'ID' },
            { accessorKey: 'sucursal', header: 'Sucursal' },
            { accessorKey: 'nombre', header: 'Nombre del equipo' },
            { accessorKey: 'marca', header: 'Marca' },
            { accessorKey: 'modelo', header: 'Modelo' },
            { accessorKey: 'tipo', header: 'Tipo' },
            { accessorKey: 'sn', header: 'Número de serie' },
            { accessorKey: 'procesador', header: 'Procesador' },
            { accessorKey: 'so', header: 'Sistema Operativo' },
            { accessorKey: 'tipodd', header: 'Tipo de disco' },
            { accessorKey: 'ram', header: 'RAM' },
            { accessorKey: 'fecha_compra', header: 'Fecha compra' },
            {
                accessorKey: 'estado',
                header: 'Estado',
                Cell: ({ cell }: { cell: MRT_Cell<any>, row: any }) => {
                    const valor = cell.getValue<string>();
                    return (
                        <Chip
                            className='text-white'
                            color={valor === 'disponible' ? 'success' : 'primary'}
                            variant="solid"
                            size='sm'
                        >
                            {valor}
                        </Chip>
                    );
                },
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
                setEquipo(row.original.id_ec);
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
                    Equipo de computo
                </h1>
                <Button
                    radius='full'
                    color="primary"
                    onPress={() => {
                        onOpen();
                        setEquipo(null);
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
                    onPress={() => exportToCSV(data, columns, "computo.csv")}>
                    Exportar
                </Button>

            </Box >
        ),
    });

    return (
        <>
            <MaterialReactTable table={table} />
            <FormCelulares isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} id_celular={id_equipo}></FormCelulares>
        </>
    );
};

export default EquipoTI;

