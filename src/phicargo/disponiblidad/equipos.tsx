import { Button, Chip } from "@heroui/react";
import {
    Dialog,
    DialogContent,
} from '@mui/material';
import {
    MRT_Cell,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { exportToCSV } from '../utils/export';
import odooApi from '@/api/odoo-api';
import IndexHistorial from ".";

type Unidad = {
    id: number;
    name: string;
    x_status: string;
}

const Disponibilidad_unidades = () => {
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [vehicle_id, setVehicle] = useState<number | null>(null);
    const [vehicle_name, setVehicleName] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await odooApi.get('/vehicles/latest-operations/');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'vehicle_name',
                header: 'Vehículo',
            },
            {
                accessorKey: 'license_plate',
                header: 'Placas',
            },
            {
                accessorKey: 'tipo_vehiculo',
                header: 'Tipo de vehiculo',
            },
            {
                accessorKey: 'x_status',
                header: 'Estado',
                Cell: ({ cell }: { cell: MRT_Cell<Unidad> }) => {
                    const estado = cell.getValue<string>() || 'desconocido';

                    return (
                        <Chip color={estado === "viaje" ? "primary" : estado === "maniobra" ? "danger" : estado === "mantenimiento" ? "success" : "default"} size='sm' className="text-white">
                            <strong>{estado.toUpperCase()}</strong>
                        </Chip>
                    );
                },
            },
            {
                accessorKey: 'ultimo_uso',
                header: 'Último uso',
                Cell: ({ cell }: { cell: MRT_Cell<Unidad> }) => {
                    const ultimo_uso = cell.getValue<string>();
                    return (
                        <Chip color={ultimo_uso === "viaje" ? "primary" : ultimo_uso === "maniobra" ? "danger" : "default"} size='sm'>
                            <strong>{ultimo_uso.toUpperCase()}</strong>
                        </Chip>
                    );
                },
            },
            {
                accessorKey: 'ultimo_uso_fecha',
                header: 'Último uso fecha',
            },
            {
                accessorKey: 'referencia_viaje',
                header: 'Último viaje',
                muiTableBodyCellProps: {
                    sx: { backgroundColor: '#007ffb', fontFamily: 'Inter', fontSize: '12px', color: 'white' },
                },
            },
            {
                accessorKey: 'sucursal_viaje',
                header: 'Sucursal',
                muiTableBodyCellProps: {
                    sx: { backgroundColor: '#007ffb', fontFamily: 'Inter', fontSize: '12px', color: 'white' },
                },
            },
            {
                accessorKey: 'last_travel_end_date',
                header: 'Finalización',
                muiTableBodyCellProps: {
                    sx: { backgroundColor: '#007ffb', fontFamily: 'Inter', fontSize: '12px', color: 'white' },
                },
            },
            {
                accessorKey: 'operador_viaje',
                header: 'Operador',
                muiTableBodyCellProps: {
                    sx: { backgroundColor: '#007ffb', fontFamily: 'Inter', fontSize: '12px', color: 'white' },
                },
            },
            {
                accessorKey: 'last_maniobra_id',
                header: 'ID Maniobra',
                muiTableBodyCellProps: {
                    sx: { backgroundColor: '#004cc4', fontFamily: 'Inter', fontSize: '12px', color: 'white' },
                },
            },
            {
                accessorKey: 'last_maniobra_end_date',
                header: 'Finalización',
                muiTableBodyCellProps: {
                    sx: { backgroundColor: '#004cc4', fontFamily: 'Inter', fontSize: '12px', color: 'white' },
                },
            },
            {
                accessorKey: 'operador_maniobra',
                header: 'Operador',
                muiTableBodyCellProps: {
                    sx: { backgroundColor: '#004cc4', fontFamily: 'Inter', fontSize: '12px', color: 'white' },
                },
            },
        ],
        [],
    );

    const handleRowClick = (id: number, name: string) => {
        setOpenDialog(true);
        setVehicle(id)
        setVehicleName(name)
    };

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
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => handleRowClick(row.original.id, row.original.name),
            style: {
                cursor: 'pointer',
            },
        }),
        muiTableHeadCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'Bold',
                fontSize: '12px',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '12px',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 175px)',
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
                    Unidades
                </h1>
                <Button size="sm" color='success' className='text-white' startContent={<i className="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "unidades.csv")}>Exportar</Button>
            </Box>
        ),
    });

    return (
        <>
            <MaterialReactTable table={table} />

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullScreen={true}>
                <AppBar
                    elevation={3} position="static"
                    sx={{
                        background: 'linear-gradient(90deg, #0b2149, #002887)',
                        padding: '0 16px'
                    }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setOpenDialog(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        {vehicle_name}
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    {vehicle_id && (
                        <IndexHistorial vehicle_id={vehicle_id}></IndexHistorial>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Disponibilidad_unidades;
