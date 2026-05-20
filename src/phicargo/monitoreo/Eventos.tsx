import { Button } from "@heroui/react";
import { Card, CardBody } from "@heroui/react";
import {
    MRT_Cell,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Chip } from "@heroui/react";
import DetalleForm, { Evento } from './DetalleEvento';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Drawer from '@mui/material/Drawer';
import EntregaForm2 from './form';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
const drawerWidth = 650;

const Main = styled('main', {
    shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: open ? 0 : -drawerWidth,
    position: 'relative',
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

export default function PersistentDrawerRight({ id_entrega, onClose }: { id_entrega: number, onClose: () => void }) {

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const [id_evento, setIDEvento] = useState<number | null>(null);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getEntrega();
        getEventos();
    }, []);

    const [data, setEventos] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [dataEntrega, setDataEntrega] = useState<Evento[]>([]);

    const getEntrega = async () => {
        try {
            const response = await odooApi.get('/entregas/get_by_entrega_id/' + id_entrega);
            setDataEntrega(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    const getEventos = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/eventos/eventos_by_entrega_id/' + id_entrega);
            setEventos(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'sucursal',
                header: 'Sucursal',
                Cell: ({ cell }: { cell: MRT_Cell<Evento> }) => {
                    const value = cell.getValue<string>();
                    return (
                        <Chip
                            className={
                                value === "veracruz"
                                    ? "success"
                                    : value === "manzanillo"
                                        ? "warning"
                                        : "default"
                            }
                        >
                            {value}
                        </Chip>
                    );
                },
            },
            {
                accessorKey: 'titulo',
                header: 'Titulo',
            },
            {
                accessorKey: 'nombre_evento',
                header: 'Clasificación',
            },
            {
                accessorKey: 'fecha_creacion',
                header: 'Creación',
            },
            {
                accessorKey: 'estado',
                header: 'Estado del evento',
                minSize: 10,
                maxSize: 10,
                size: 10,
                Cell: ({ cell }: { cell: MRT_Cell<Evento> }) => {
                    const value = cell.getValue<string>();
                    return <Chip className={value === "atendido" ? "success" : "default"}>{value}</Chip>;
                },
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
        state: { showProgressBars: isLoading },
        localization: MRT_Localization_ES,
        enableColumnPinning: true,
        enableStickyHeader: true,
        columnResizeMode: "onEnd",
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
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                handleDrawerOpen();
                setIDEvento(row.original.id_evento)
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

    const [open2, setOpen2] = React.useState(false);

    const handleClickOpen2 = () => {
        setOpen2(true);
    };

    const handleClose2 = () => {
        setOpen2(false);
        getEventos();
    };

    const cerrar_entrega = async () => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción cerrará tu entrega y no podrá ser revertida.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, cerrar entrega'
            });

            if (result.isConfirmed) {
                const response = await odooApi.get('/entregas/cerrar_entrega/' + id_entrega);
                const data = response.data;
                if (data === 1) {
                    toast.success(data.message);
                    onClose();
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            toast.error('Hubo un problema al intentar cerrar la entrega.');
        }
    };

    return (<>
        <Box sx={{ display: 'flex' }}>
            <Main open={open}>
                <Stack spacing={2} direction="row">
                    {dataEntrega.length > 0 && dataEntrega[0].estado !== 'cerrado' && (
                        <Button onPress={handleClickOpen2} color='primary' radius="full">Nuevo evento</Button>
                    )}

                    {dataEntrega.length > 0 && dataEntrega[0].estado !== 'cerrado' && (
                        <Button onPress={cerrar_entrega} color='danger' radius="full">Cerrar entrega</Button>
                    )}
                </Stack>
                <Card className='mt-3'>
                    <CardBody>
                        <MaterialReactTable table={table} />
                    </CardBody>
                </Card>
            </Main>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    },
                }}
                variant="persistent"
                anchor="right"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                {id_evento && (
                    <DetalleForm id_evento={id_evento} onClose={handleClose2}></DetalleForm>
                )}
            </Drawer>
        </Box>

        <Dialog
            open={open2}
            onClose={handleClose2}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent className='p-5'>
                <EntregaForm2 id_entrega={id_entrega} onClose={handleClose2}></EntregaForm2>
            </DialogContent>
        </Dialog>
    </>
    );
}