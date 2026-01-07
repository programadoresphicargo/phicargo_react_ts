import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { Chip } from "@heroui/react";
import Travel from '@/phicargo/viajes/control/viaje';
import { ViajeContext } from '@/phicargo/viajes/context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

const HistorialViajesVehiculo = ({ vehicle_id }) => {

    const [isLoading, setLoading] = useState();
    const [data, setData] = useState([]);
    const [open, setModalShow] = useState(false);
    const [idViaje, setIDViaje] = useState(false);

    const handleShowModal = (id_viaje) => {
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
            pagination: { pageSize: 80 },
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
            onClick: ({ event }) => {
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
            <Travel idViaje={idViaje} open={open} handleClose={handleCloseModal}></Travel>
        </>
    );
};

export default HistorialViajesVehiculo;
