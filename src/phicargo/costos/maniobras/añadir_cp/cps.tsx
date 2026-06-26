import { Card, CardBody } from "@heroui/react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useContext, useEffect, useMemo, useState } from 'react';
import AñadirContenedor from './añadir_cp';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import { useCostosExtras } from '../../context/context';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { ViajeContext } from '@/phicargo/viajes/context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const CostosExtrasContenedores = ({ id_folio }: { id_folio: number | null }) => {

    const contexto = useContext(ViajeContext);
    const id_viaje = contexto?.id_viaje ?? null;

    const { CartasPorte, setCPS, setCPSEliminadas, DisabledForm } = useCostosExtras();
    const [open, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const handleDelete = (id: number) => {
        setCPSEliminadas((prev) => [...prev, { id }]);
        setCPS((prev) => prev.filter(item => item.id !== id));
    };

    const handleShow = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
    };

    const columns = useMemo(
        () => [
            { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'referencia_viaje', header: 'Viaje' },
            { accessorKey: 'name', header: 'Cartas porte' },
            { accessorKey: 'x_reference', header: 'Contenedor' },
        ],
        []
    );

    const fetchDataCP = async () => {
        try {
            setLoading(true);
            toast.success('Obteniendo cartas porte de viaje');
            const response = await odooApi.get('/tms_waybill/get_by_travel_id/' + id_viaje);
            setCPS(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id_folio == null && id_viaje != null) {
            fetchDataCP();
        }
    }, [id_folio]);

    const table = useMaterialReactTable({
        columns,
        data: CartasPorte,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        positionActionsColumn: 'last',
        state: { showProgressBars: isLoading },
        localization: MRT_Localization_ES,
        initialState: {
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
        },
        muiTablePaperProps: { elevation: 0, sx: { boxShadow: 'none' } },
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Box>
                <IconButton onClick={() => handleDelete(row.original.id)} disabled={DisabledForm}>
                    <DeleteIcon />
                </IconButton>
            </Box>
        ),
        muiTableBodyRowProps: () => ({
            style: { cursor: 'pointer' },
        }),
        muiTableHeadCellProps: { sx: { fontFamily: 'Inter', fontWeight: 'Bold', fontSize: '14px' } },
        muiTableBodyCellProps: { sx: { fontFamily: 'Inter', fontWeight: 'normal', fontSize: '14px' } },
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
                    Cartas porte
                </h1>
                <Button radius="full" color='primary' onPress={handleShow} isDisabled={DisabledForm} startContent={<i className="bi bi-plus-lg"></i>} size="sm">Añadir carta porte</Button>
            </Box>
        ),
    });

    return (
        <>
            <Card>
                <CardBody>
                    <AñadirContenedor open={open} handleClose={handleClose} />
                    <MaterialReactTable table={table} />
                </CardBody>
            </Card>
        </>
    );
};

export default CostosExtrasContenedores;
