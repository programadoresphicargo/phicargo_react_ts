import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import AñadirContenedor from './modal_cps';
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
import odooApi from '@/api/odoo-api';
import { ManiobraContext } from '../../context/viajeContext';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const ManiobraContenedores = ({ id_maniobra }) => {
    const [modalShow, setModalShow] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const { formData, setFormData, formDisabled } = useContext(ManiobraContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await odooApi.get('/maniobras/contenedores/' + id_maniobra);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    cps_ligadas: response.data || [],
                }));
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, [id_maniobra]);

    const handleShowModal = () => {
        setModalShow(true);
    };

    const handleCloseModal = () => {
        setModalShow(false);
    };


    //Dialog para confirmar borrado
    const handleOpenDialog = (id) => {
        setSelectedId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedId(null);
    };

    const confirmarBorrado = () => {
        const contenedor = formData.cps_ligadas.find(c => c.id === selectedId);

        if (contenedor) {
            // Eliminar de cps_ligadas y añadir a cps_desligadas
            setFormData(prev => ({
                ...prev,
                cps_ligadas: prev.cps_ligadas.filter(c => c.id !== selectedId),
                cps_desligadas: [...(prev.cps_desligadas || []), contenedor],
            }));
        }

        setOpenDialog(false);
        setSelectedId(null);
        toast.info('Contenedor marcado para eliminación. Recuerda guardar los cambios.');
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID Carta',
            },
            {
                accessorKey: 'name',
                header: 'Carta porte',
            },
            {
                accessorKey: 'x_reference',
                header: 'Contenedor',
            },
            {
                accessorKey: 'dangerous_cargo',
                header: 'Peligroso',
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    return value ? 'SI' : 'NO';
                }
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: formData.cps_ligadas || [],
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        localization: MRT_Localization_ES,
        state: { showProgressBars: isLoading },
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                boxShadow: 'none',
            },
        },
        positionActionsColumn: 'last',
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Box>
                <Button onPress={() => handleOpenDialog(row.original.id)} startContent={<DeleteIcon />} size='sm' color='primary' isDisabled={formDisabled}></Button>
            </Box>
        ),
        muiTableBodyRowProps: ({ row }) => ({
            onDoubleClick: () => {
                handleOpenDialog(row.original.id);
            },
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
    });

    return (
        <>
            <Card>
                <CardBody>
                    <div>
                        <Button color='primary' onPress={handleShowModal}>
                            Añadir contenedor
                        </Button>
                        <AñadirContenedor
                            show={modalShow}
                            handleClose={handleCloseModal}
                            id_maniobra={id_maniobra}
                        />
                        <MaterialReactTable table={table} />

                        <Dialog
                            open={openDialog}
                            onClose={handleCloseDialog}
                            fullWidth
                            maxWidth={"sm"}
                        >
                            <DialogTitle>¿Estás seguro?</DialogTitle>
                            <DialogActions>
                                <Button onPress={handleCloseDialog} color="default" className="text-white">
                                    Cancelar
                                </Button>
                                <Button onPress={confirmarBorrado} color="primary">
                                    Sí, borrar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </CardBody>
            </Card>
        </>
    );
};

export default ManiobraContenedores;
