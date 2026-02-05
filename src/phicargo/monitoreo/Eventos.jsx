import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { Card, CardBody, CardFooter, CardHeader, Divider, Image, Link } from "@heroui/react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { styled, useTheme } from '@mui/material/styles';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Chip } from "@heroui/react";
import CssBaseline from '@mui/material/CssBaseline';
import DetalleForm from './DetalleEvento';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Drawer from '@mui/material/Drawer';
import EntregaForm2 from './entregaForm';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MuiAppBar from '@mui/material/AppBar';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { width } from '@mui/system';
const drawerWidth = 650;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        position: 'relative',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    marginRight: 0,
                },
            },
        ],
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginRight: drawerWidth,
            },
        },
    ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

export default function PersistentDrawerRight({ id_entrega, onClose }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const [id_evento, setIDEvento] = useState(0);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const initialFormData = {
        id_entrega: id_entrega,
        titulo: '',
        descripcion: '',
        sucursal: '',
        tipo_evento: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        getEntrega();
        getEventos();
    }, []);

    const [data, setEventos] = useState([]);
    const [isLoading, setLoading] = useState();
    const [dataEntrega, setDataEntrega] = useState([]);

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
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    let className;

                    if (value === 'veracruz') {
                        className = 'badge bg-success text-white';
                    } else if (value === 'manzanillo') {
                        className = 'badge bg-warning text-white';
                    } else {
                        className = 'badge bg-primary text-white';
                    }

                    return <Chip className={className}>{value}</Chip>;
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
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    let className;

                    if (value === 'atendido') {
                        className = 'badge bg-success rounded-pill text-white';
                    }

                    return <Chip className={className}>{value}</Chip>;
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
        state: { isLoading: isLoading },
        enableColumnPinning: true,
        enableStickyHeader: true,
        columnResizeMode: "onEnd",
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
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
                        <Button onClick={handleClickOpen2} color='primary' radius="full">Nuevo evento</Button>
                    )}

                    {dataEntrega.length > 0 && dataEntrega[0].estado !== 'cerrado' && (
                        <Button onClick={cerrar_entrega} color='danger' radius="full">Cerrar entrega</Button>
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

                <DetalleForm id_evento={id_evento} onClose={handleClose2}></DetalleForm>

            </Drawer>
        </Box>

        <Dialog
            open={open2}
            onClose={handleClose2}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent className='p-5'>
                <DialogContentText id="alert-dialog-description">
                    <EntregaForm2 id_entrega={id_entrega} onClose={handleClose2}></EntregaForm2>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    </>
    );
}