import { Button, Card, CardBody } from "@heroui/react";
import { MRT_Cell, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, isValid } from 'date-fns';
import { Box } from '@mui/system';
import { Chip } from "@heroui/react";
import Formulariomaniobra from './form';
import odooApi from '@/api/odoo-api';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Contenedor } from "../tms_waybill/cartas_porte";

export type Maniobra = {
    id_maniobra: number;
}

const Registromaniobras = ({ dataCP }: { dataCP: Contenedor }) => {

    const [isLoading, setLoading] = useState(false);
    const [id_maniobra, setIDManiobra] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
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
    }, [open]);

    const handleShow = () => {
        setOpen(true);
    };

    const abrir_nueva = () => {
        setIDManiobra(null);
        handleShow();
    };

    const handleClose = () => {
        setOpen(false);
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
                Cell: ({ cell }: { cell: MRT_Cell<Maniobra> }) => {
                    const value = cell.getValue<string>();
                    const date = value ? new Date(value) : null;
                    const formattedDate = date && isValid(date) ? format(date, 'yyyy/MM/dd h:mm a') : 'Fecha no válida';

                    return <span>{formattedDate}</span>;
                },
            },
            {
                accessorKey: 'estado_maniobra',
                header: 'Estado maniobra',
                size: 150,
                Cell: ({ cell }: { cell: MRT_Cell<Maniobra> }) => {
                    const value = cell.getValue<string>();

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
                setIDManiobra(row.original.id_maniobra);
                handleShow();
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
        renderTopToolbarCustomActions: () => (
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
                show={open}
                handleClose={handleClose}
                id_maniobra={id_maniobra}
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
