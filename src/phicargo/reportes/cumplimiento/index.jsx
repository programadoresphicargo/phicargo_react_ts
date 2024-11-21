import React, { useState, useEffect, useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import MonitoreoNavbar from '../../monitoreo/Navbar';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const ReporteCumplimiento = () => {

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
                const response = await fetch('/phicargo/viajes/reportes/reporte_cumplimiento_operador.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({ inicio: startDate, fin: endDate }),
                });
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [dates]);

    const columns = useMemo(
        () => [
            { accessorKey: 'referencia', header: 'Sucursal' },
            { accessorKey: 'name', header: 'Operador', size: 150 },
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
                <Button variant="contained" color="primary" onClick={exportToCSV}>
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
