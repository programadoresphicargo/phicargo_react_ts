import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Travel from '@/phicargo/viajes/control/viaje';
import odooApi from '@/api/odoo-api';

type Travel = { id: number; }

const HistorialViajesVehiculo = ({ vehicle_id }: { vehicle_id: number }) => {

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState<Travel[]>([]);
    const [open, setModalShow] = useState(false);
    const [idViaje, setIDViaje] = useState<number | null>(null);

    const handleShowModal = (id_viaje: number) => {
        setIDViaje(id_viaje);
        setModalShow(true);
    };

    const handleCloseModal = () => {
        setModalShow(false);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/history/' + vehicle_id);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Referencia',
            },
            {
                accessorKey: 'sucursal',
                header: 'Sucursal',
            },
            {
                accessorKey: 'unidad',
                header: 'Unidad',
            },
            {
                accessorKey: 'nombre_operador',
                header: 'Operador',
                size: 150,
            },
            {
                accessorKey: 'fecha_finalizado',
                header: 'Fecha finalizado',
                size: 150,
            },
            {
                accessorKey: 'cartas_porte',
                header: 'Cartas porte',
                size: 150,
            },
            {
                accessorKey: 'contenedores_ids',
                header: 'Contenedor',
                size: 150,
            },
            {
                accessorKey: 'nombre_cliente',
                header: 'Cliente',
                size: 150,
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
        initialState: {
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
        },
        state: { isLoading: isLoading },
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
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                if (row.subRows?.length) {
                } else {
                    handleShowModal(row.original.id);
                }
            },
            style: {
                cursor: 'pointer',
            },
        }),
    });

    return (
        <>
            <MaterialReactTable table={table} />
            {idViaje && (
                <Travel idViaje={idViaje} open={open} handleClose={handleCloseModal}></Travel>
            )}
        </>
    );
};

export default HistorialViajesVehiculo;
