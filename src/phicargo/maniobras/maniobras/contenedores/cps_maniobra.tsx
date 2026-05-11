import React, { useState, useMemo, useContext } from 'react';
import { MRT_Cell, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import AñadirContenedor from './modal_cps';
import { Button, CardHeader } from "@heroui/react";
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import { Card, CardBody } from "@heroui/react";
import { ManiobraContext } from '../../context/viajeContext';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

type Contenedores = {
    id: number;
    dangerous_cargo: boolean;
};

type Props = {
    id_maniobra?: number | null;
};

const ManiobraContenedores: React.FC<Props> = ({
    id_maniobra
}) => {

    const [modalShow, setModalShow] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { formDisabled, cps_ligadas, setCpsLigadas, setCpsDesligadas } = useContext(ManiobraContext);

    const handleShowModal = () => {
        setModalShow(true);
    };

    const handleCloseModal = () => {
        setModalShow(false);
    };


    //Dialog para confirmar borrado
    const handleOpenDialog = (id: number) => {
        setSelectedId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedId(null);
    };

    const confirmarBorrado = () => {
        const contenedor = cps_ligadas.find(c => c.id === selectedId);

        if (contenedor) {
            // 1. Quitar de cps_ligadas
            setCpsLigadas(prev =>
                prev.filter(c => c.id !== selectedId)
            );

            // 2. Agregar a cps_desligadas
            setCpsDesligadas(prev => [
                ...(prev || []),
                contenedor
            ]);
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
                Cell: ({ cell }: { cell: MRT_Cell<Contenedores> }) => {
                    const value = cell.getValue<boolean>();
                    return value ? 'SI' : 'NO';
                }
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: cps_ligadas,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        localization: MRT_Localization_ES,
        initialState: {
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 80 },
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
                <Button onPress={() => handleOpenDialog(row.original.id)} startContent={<DeleteIcon />} size='sm' color='primary' isDisabled={formDisabled} radius='full'></Button>
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
                <CardHeader
                    style={{
                        background: 'linear-gradient(90deg, #0b2149, #002887)',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                    Contenedores
                </CardHeader>
                <CardBody>
                    <div>
                        <Button color='primary' onPress={handleShowModal} isDisabled={formDisabled} radius='full'>
                            Añadir contenedor
                        </Button>
                        <AñadirContenedor
                            show={modalShow}
                            handleClose={handleCloseModal}
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
                                <Button onPress={handleCloseDialog} color="default" className="text-white" radius='full'>
                                    Cancelar
                                </Button>
                                <Button onPress={confirmarBorrado} color="primary" radius='full'>
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
