import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Formulariomaniobra from '@/phicargo/maniobras/maniobras/form';
import odooApi from '@/api/odoo-api';
import { Contenedor } from '@/phicargo/maniobras/tms_waybill/cartas_porte';
import { Maniobra } from '@/phicargo/maniobras/maniobras/registros';

const HistorialManiobrasVehiculo = ({ vehicle_id }: { vehicle_id: number }) => {

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState<Maniobra[]>([]);
    const [modalShow, setModalShow] = useState(false);
    const [id_maniobra, setIdmaniobra] = useState<number | null>(null);
    const [dataCP, setDataCP] = useState<Contenedor>();

    const handleShowModal = (id_maniobra: number, data: any) => {
        setModalShow(true);
        setIdmaniobra(id_maniobra);
        setDataCP(data);
    };

    const handleCloseModal = () => {
        setModalShow(false);
        fetchData();
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/maniobras/historial_vehicular/' + vehicle_id);
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
                accessorKey: 'id_maniobra',
                header: 'ID Maniobra',
            },
            {
                accessorKey: 'sucursal',
                header: 'Sucursal',
            },
            {
                accessorKey: 'inicio_programado',
                header: 'Inicio programado',
            },
            {
                accessorKey: 'tipo_maniobra',
                header: 'Tipo de maniobra',
            },
            {
                accessorKey: 'terminal',
                header: 'Terminal',
            },
            {
                accessorKey: 'unidad',
                header: 'Unidad',
            },
            {
                accessorKey: 'nombre_operador',
                header: 'Operador',
            },
            {
                accessorKey: 'fecha_activacion',
                header: 'Fecha de inicio',
            },
            {
                accessorKey: 'fecha_finalizada',
                header: 'Fecha finalizada',
            },
            {
                accessorKey: 'x_ejecutivo_viaje_bel',
                header: 'Ejecutivo',
            },
            {
                accessorKey: 'ultimo_estatus',
                header: 'Ultimo estatus enviado',
            },
            {
                accessorKey: 'cartas_porte',
                header: 'Cartas porte',
            },
            {
                accessorKey: 'contenedores_ids',
                header: 'Contenedor',
            },
            {
                accessorKey: 'nombre_cliente',
                header: 'Cliente',
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
                    handleShowModal(row.original.id_maniobra, row.original);
                }
            },
            style: {
                cursor: 'pointer',
            },
        }),
    });

    return (<>
        <MaterialReactTable table={table} />
        <Formulariomaniobra
            show={modalShow}
            handleClose={handleCloseModal}
            id_maniobra={id_maniobra}
            dataCP={dataCP}
        />
    </>
    );
};

export default HistorialManiobrasVehiculo;
