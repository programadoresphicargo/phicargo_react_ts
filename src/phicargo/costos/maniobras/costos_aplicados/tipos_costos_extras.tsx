import {
    MRT_ColumnDef,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { CostoExtraAplicado, FolioCostoExtra } from '../../folios/tabla';
import { UseFieldArrayAppend } from 'react-hook-form';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

type Props = {
    onClose: () => void,
    append: UseFieldArrayAppend<FolioCostoExtra, "costos_extras">;
};

const ServiciosExtras = ({ onClose, append }: Props) => {

    const [data, setData] = useState<CostoExtraAplicado[]>([]);
    const [isLoading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/tipos_costos_extras/');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo<MRT_ColumnDef<CostoExtraAplicado>[]>(
        () => [
            {
                accessorKey: 'id_tipo_costo',
                header: 'Referencia',
            },
            {
                accessorKey: 'descripcion',
                header: 'Descripción',
            },
            {
                accessorKey: 'costo',
                header: 'Costo',
            },
            {
                accessorKey: 'unidad_medida',
                header: 'Unidad medida',
            },
            {
                accessorKey: 'observaciones',
                header: 'Observaciones',
            },
        ],
        [],
    );

    const table = useMaterialReactTable<CostoExtraAplicado>({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        state: { showProgressBars: isLoading },
        enableColumnPinning: true,
        enableStickyHeader: true,
        columnResizeMode: "onEnd",
        localization: MRT_Localization_ES,
        initialState: {
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
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
                borderRadius: '8px',
                overflow: 'hidden',
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
                <h1>Catalogo de costos extras</h1>
            </Box>
        ),
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                const servicioSeleccionado = row.original;

                const servicioConExtras = {
                    ...servicioSeleccionado,
                    cantidad: 1,
                    iva: .16,
                    retencion: 0,
                    subtotal: servicioSeleccionado.costo,
                    total: servicioSeleccionado.costo,
                    ajuste_cobro: 0
                };

                append(servicioConExtras);
                onClose();
            },
            sx: {
                cursor: 'pointer',
            },
        }),
    });

    return (
        <>
            <MaterialReactTable table={table} />
        </>
    );
};

export default ServiciosExtras;
