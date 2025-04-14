import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import { Button } from "@heroui/react"
import { DatePicker } from 'antd';
import MonitoreoNavbar from '../../monitoreo/Navbar';
import odooApi from '@/api/odoo-api';
const { RangePicker } = DatePicker;

const ReporteCumplimiento = () => {

    const [isLoading, setLoading] = useState(false);

    const [dates, setDates] = useState([]);

    const handleDateChange = (dates) => {
        setDates(dates);
    };

    const [data, setData] = useState([]);

    const fetchData = async () => {
        if (dates && dates.length === 2 && dates[0] && dates[1]) {
            const startDate = dates[0].format('YYYY-MM-DD');
            const endDate = dates[1].format('YYYY-MM-DD');
            try {
                setLoading(true);
                const response = await odooApi.get('/reportes_estatus_viajes/cumplimiento_estatus_operadores/' + startDate + '/' + endDate);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [dates]);

    const columns = useMemo(
        () => [
            { accessorKey: 'referencia', header: 'Referencia' },
            { accessorKey: 'id_usuario', header: 'Operador', size: 150 },
            { accessorKey: 'nombre_operador', header: 'Operador', size: 150 },
            { accessorKey: 'fecha_inicio', header: 'Fecha inicio', size: 150 },
            { accessorKey: 'estatus_enviados', header: 'Estatus enviados', size: 150 },
            { accessorKey: 'porcentaje_estatus', header: 'Porcentaje de cumplimiento', size: 150 },
            { accessorKey: 'estatus_encontrados', header: 'Estatus_enviados', size: 100 },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        state: { showProgressBars: isLoading },
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => { },
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
        muiTableBodyCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '14px',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 202px)',
            },
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <RangePicker onChange={handleDateChange} />
                <Button color="primary" onPress={exportToCSV}>
                    Exportar
                </Button>
            </Box>
        ),
    });

    const exportToCSV = () => {
        const csvRows = [];
        const headers = columns.map(column => column.header);
        csvRows.push(headers.join(','));

        data.forEach(row => {
            const values = columns.map(column => {
                const value = row[column.accessorKey];
                return `"${value}"`;
            });
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'reporte_cumplimiento.csv');
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <MonitoreoNavbar />
            <MaterialReactTable table={table} />
        </div>
    );
};

export default ReporteCumplimiento;
