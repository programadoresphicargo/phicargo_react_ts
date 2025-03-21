import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import AñadirContenedor from './modal_añadir_contenedor';
import axios from 'axios';
import { Button } from "@heroui/react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import { Card, CardBody } from "@heroui/react";
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { ViajeContext } from '@/phicargo/viajes/context/viajeContext';
import { CostosExtrasContext } from '../../context/context';

const CostosExtrasContenedores = ({ }) => {

    const contexto = useContext(ViajeContext);
    const id_viaje = contexto?.id_viaje ?? null;

    const { id_folio, CartasPorte, setCPS, CartasPorteEliminadas, setCPSEliminadas, DisabledForm, setDisabledForm } = useContext(CostosExtrasContext);
    const [modalShow, setModalShow] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const handleDelete = (id) => {
        setCPSEliminadas((prev) => [...prev, { id }]);
        setCPS((prev) => prev.filter(item => item.id !== id));
    };

    const handleShowModal = () => setModalShow(true);

    const handleCloseModal = () => {
        setModalShow(false);
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

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/folios_cartas_porte/by_id_folio/' + id_folio);
            setCPS(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

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
        fetchData();
    }, []);

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
        state: { isLoading: isLoading },
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
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
        muiTableBodyRowProps: ({ row }) => ({
            onDoubleClick: () => setOpenDialog(row.original.id),
            style: { cursor: 'pointer' },
        }),
        muiTableHeadCellProps: { sx: { fontFamily: 'Inter', fontWeight: 'Bold', fontSize: '14px' } },
        muiTableBodyCellProps: { sx: { fontFamily: 'Inter', fontWeight: 'normal', fontSize: '14px' } },
        renderTopToolbarCustomActions: ({ table }) => (
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
                <Button color='primary' onPress={handleShowModal} isDisabled={DisabledForm} startContent={<i className="bi bi-plus-lg"></i>}>Añadir carta porte</Button>
            </Box>
        ),
    });

    return (
        <>
            <Card>
                <CardBody>
                    <AñadirContenedor show={modalShow} handleClose={handleCloseModal} />
                    <MaterialReactTable table={table} />
                </CardBody>
            </Card>
        </>
    );
};

export default CostosExtrasContenedores;
