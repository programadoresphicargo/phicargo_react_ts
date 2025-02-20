import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
const { VITE_PHIDES_API_URL } = import.meta.env;

const ManiobraContenedores = ({ id_maniobra }) => {
    const [modalShow, setModalShow] = useState(false);
    const [data, setData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(VITE_PHIDES_API_URL + '/modulo_maniobras/maniobra/get_maniobra_contenedores.php?id_maniobra=' + id_maniobra);
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }, [id_maniobra]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleShowModal = () => {
        setModalShow(true);
    };

    const handleCloseModal = () => {
        setModalShow(false);
        fetchData();
    };

    const handleOpenDialog = (id) => {
        setSelectedId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedId(null);
    };

    const confirmarBorrado = () => {
        if (selectedId) {
            axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/maniobra/borrar_contenedor.php?id=' + selectedId)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        toast.success('El registro ha sido exitoso.');
                        fetchData();
                    } else {
                        toast.error(data);
                    }
                })
                .catch((error) => {
                    toast.error(error);
                });
        }
        handleCloseDialog();
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
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
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
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
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Box>
                <IconButton onClick={() => handleOpenDialog(row.original.id)}>
                    <DeleteIcon />
                </IconButton>
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
                        <Button color='primary' onClick={handleShowModal}>
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
                        >
                            <DialogTitle>¿Estás seguro?</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    No podrás revertir esto!
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} color="primary">
                                    Cancelar
                                </Button>
                                <Button onClick={confirmarBorrado} color="secondary">
                                    Sí, bórralo!
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
