import { Button, Chip, Tooltip } from "@heroui/react";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { exportToCSV } from '../utils/export';
import odooApi from '@/api/odoo-api';
import FormularioRemolques from "./formulario";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Travel from "../viajes/control/viaje";
import { RecordDetailsModal } from "@/modules/maintenance/components/RecordDetailsModal";
import { MaintenanceRecord } from "@/modules/maintenance/models";

/* =========================
   TIPOS
========================= */

type Remolque = {
    name2: string;
    license_plate: string;
    categoria: string;
    fleet_type: string;
    sucursal: string;
    x_modalidad?: string;
    x_tipo_carga?: string;
    x_dc_compatible?: boolean;
    x_hc_compatible?: boolean;
    x_status?: string;
    viaje_name?: string;
    viaje_id?: number;
    viaje_estado?: string;
    x_maniobra?: string;
    estado_maniobra?: string;
    tipo_maniobra?: string;
    mantenimiento_id?: number;
    mantenimiento_status?: string;
};

/* =========================
   COMPONENTE
========================= */

const Remolques: React.FC = () => {

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState<Remolque[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [vehicleData, setVehicle] = useState<Remolque | null>(null);

    const [openTravel, setOpenTravel] = useState(false);
    const [idViaje, setIDViaje] = useState<number | null>(null);

    const [openReport, setOpenReport] = useState(false);
    const [reportDetail, setReportDetail] = useState<MaintenanceRecord | null>(null);

    /* =========================
       HANDLERS
    ========================= */

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await odooApi.get('/vehicles/remolques/');
            setData(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!openDialog) fetchData();
    }, [openDialog]);

    /* =========================
       COLUMNAS
    ========================= */

    const columns = useMemo<MRT_ColumnDef<Remolque>[]>(() => [
        {
            accessorKey: 'name2',
            header: 'Vehículo',
            Cell: ({ cell }) => (
                <Chip color="primary" size="sm">
                    {cell.getValue<string>()}
                </Chip>
            ),
        },
        { accessorKey: 'license_plate', header: 'Placas' },
        { accessorKey: 'categoria', header: 'Tipo de vehículo' },
        { accessorKey: 'fleet_type', header: 'Tipo' },
        { accessorKey: 'sucursal', header: 'Sucursal' },

        {
            accessorKey: 'x_modalidad',
            header: 'Modalidad',
            Cell: ({ cell }) => {
                const modalidad = cell.getValue<string | undefined>();
                if (!modalidad) return null;

                const color =
                    modalidad === 'sencillo' ? 'warning' :
                        modalidad === 'full' ? 'danger' :
                            'default';

                return <Chip color={color} size="sm" className="text-white">{modalidad}</Chip>;
            },
        },
        {
            accessorKey: 'x_tipo_carga',
            header: 'Tipo de carga',
            Cell: ({ cell }) => {
                const tipo = cell.getValue<string | undefined>();
                if (!tipo) return null;

                const color =
                    tipo === 'general' ? 'success' :
                        tipo === 'imo' ? 'danger' :
                            'default';

                return <Chip color={color} size="sm" className="text-white">{tipo}</Chip>;
            },
        },
        {
            accessorKey: 'x_status',
            header: 'Estado',
            Cell: ({ cell }) => {
                const estado = cell.getValue<string | undefined>();
                if (!estado) return null;

                const color =
                    estado === 'disponible' ? 'success' :
                        estado === 'viaje' ? 'primary' :
                            estado === 'maniobra' ? 'secondary' :
                                estado === 'mantenimiento' ? 'warning' :
                                    'default';

                return <Chip color={color} size="sm" className="text-white">{estado}</Chip>;
            },
        },
        {
            accessorKey: 'viaje_name',
            header: 'Viaje',
            Cell: ({ cell, row }) => {
                const nombre = cell.getValue<string | undefined>();
                if (!nombre) return null;

                return (
                    <Tooltip content={`Estado: ${row.original.viaje_estado ?? 'N/A'}`}>
                        <Button
                            size="sm"
                            radius="full"
                            color="primary"
                            onPress={() => {
                                setIDViaje(row.original.viaje_id ?? null);
                                setOpenTravel(true);
                            }}
                        >
                            {nombre}
                        </Button>
                    </Tooltip>
                );
            },
        },
        {
            accessorKey: 'x_maniobra',
            header: 'Maniobra',
            Cell: ({ cell, row }) => {
                const maniobra = cell.getValue<string | undefined>();
                if (!maniobra) return null;

                return (
                    <Tooltip content={`Estado: ${row.original.estado_maniobra ?? 'N/A'}`}>
                        <Button size="sm" radius="full" color="secondary">
                            {maniobra} {row.original.tipo_maniobra}
                        </Button>
                    </Tooltip>
                );
            },
        },
        {
            accessorKey: 'mantenimiento_id',
            header: 'Mantenimiento',
            Cell: ({ cell, row }) => {
                const id = cell.getValue<number | undefined>();
                if (!id) return null;

                const handleOpen = async () => {
                    const response = await odooApi.get(`/maintenance-record/${id}`);
                    setReportDetail(response.data);
                    setOpenReport(true);
                };

                return (
                    <Tooltip content={`Estado: ${row.original.mantenimiento_status ?? 'N/A'}`}>
                        <Button
                            size="sm"
                            radius="full"
                            color="success"
                            className="text-white"
                            onPress={handleOpen}
                        >
                            {id}
                        </Button>
                    </Tooltip>
                );
            },
        },
    ], []);

    /* =========================
       TABLA
    ========================= */

    const table = useMaterialReactTable({
        columns,
        data,
        localization: MRT_Localization_ES,
        enableGrouping: true,
        enableFilters: true,
        enableGlobalFilter: true,
        enableRowActions: true,
        initialState: {
            density: 'compact',
            showColumnFilters: true,
            pagination: { pageSize: 100, pageIndex: 0 },
        },
        state: { showProgressBars: isLoading },
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
                maxHeight: 'calc(100vh - 180px)',
            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        renderRowActions: ({ row }) => (
            <Button
                size="sm"
                radius="full"
                color="success"
                className="text-white"
                onPress={() => {
                    setVehicle(row.original);
                    setOpenDialog(true);
                }}
            >
                Editar
            </Button>
        ),
        renderTopToolbarCustomActions: () => (
            <Box sx={{ display: 'flex', gap: 2, p: 1, flexWrap: 'wrap' }}>
                <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
                    Remolques
                </h1>
                <Button size="sm" radius="full" color="success" className="text-white"
                    onPress={() => exportToCSV(data, columns, 'unidades.csv')}
                >
                    Exportar
                </Button>
                <Button size="sm" radius="full" color="danger" className="text-white"
                    onPress={fetchData}
                >
                    Recargar
                </Button>
            </Box>
        ),
    });

    /* =========================
       RENDER
    ========================= */

    return (
        <>
            <MaterialReactTable table={table} />

            <FormularioRemolques
                isOpen={openDialog}
                onOpenChange={setOpenDialog}
                vehicle_data={vehicleData}
            />

            {idViaje && (
                <Travel
                    idViaje={idViaje}
                    open={openTravel}
                    handleClose={() => setOpenTravel(false)}
                />
            )}

            {reportDetail && (
                <RecordDetailsModal
                    open={openReport}
                    onClose={() => setOpenReport(false)}
                    record={reportDetail}
                />
            )}
        </>
    );
};

export default Remolques;
