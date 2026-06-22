import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react"
import odooApi from '@/api/odoo-api';
import CustomNavbar from '@/pages/CustomNavbar';
import { DateRangePicker } from 'rsuite';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '@/phicargo/utils/export';

const ReporteCumplimiento = () => {

    const [isLoading, setLoading] = useState(false);

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const [range, setRange] = useState<[Date, Date] | null>([firstDay, lastDay]);

    const [data, setData] = useState([]);

    const fetchData = async () => {
        if (!range) return;
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/reportes_estatus_viajes/cumplimiento_estatus_operadores/', {
                params: {
                    fecha_inicio: range[0].toISOString().slice(0, 10),
                    fecha_fin: range[1].toISOString().slice(0, 10),
                }
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [range]);

    const columns = useMemo(
        () => [
            { accessorKey: 'referencia', header: 'Referencia' },
            { accessorKey: 'id_usuario', header: 'ID Usuario' },
            { accessorKey: 'nombre_operador', header: 'Operador' },
            { accessorKey: 'fecha_inicio', header: 'Fecha inicio' },
            { accessorKey: 'estatus_enviados', header: 'Estatus enviados' },
            { accessorKey: 'porcentaje_estatus', header: 'Porcentaje de cumplimiento' },
            { accessorKey: 'estatus_encontrados', header: 'Estatus_enviados' },
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
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
        },
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
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <DateRangePicker
                    value={range}
                    onChange={(value) => setRange(value)}
                    placeholder="Selecciona un rango de fechas"
                    format="yyyy-MM-dd"
                    loading={isLoading}
                />
                <Button color='success' className='text-white' startContent={<i className="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "reporte_estatus_operadores.csv")} radius='full'>Exportar</Button>
            </Box>
        ),
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
    });

    return (
        <>
            <CustomNavbar></CustomNavbar>
            <MaterialReactTable table={table} />
        </>
    );
};

export default ReporteCumplimiento;
