import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Swal from 'sweetalert2';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { width } from '@mui/system';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DetalleForm from './DetalleEvento';
import EntregaForm2 from './entregaForm';
import { Chip } from '@nextui-org/react';
const { VITE_PHIDES_API_URL } = import.meta.env;
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
            const response = await fetch(VITE_PHIDES_API_URL + '/monitoreo/entrega_turno/getEntrega.php?id_entrega=' + id_entrega);
            const jsonData = await response.json();
            setDataEntrega(jsonData);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    const getEventos = async () => {
        try {
            setLoading(true);
            const response = await fetch(VITE_PHIDES_API_URL + '/monitoreo/entrega_turno/getEventos.php?id_entrega=' + id_entrega);
            const jsonData = await response.json();
            setEventos(jsonData);
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

                    if (value === 'VERACRUZ') {
                        className = 'badge bg-success text-white';
                    } else if (value === 'MANZANILLO') {
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
                header: 'Estado',
                minSize: 10,
                maxSize: 10,
                size: 10,
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    let className;

                    if (value === 'atendido') {
                        className = 'badge bg-success rounded-pill text-white';
                    }

                    return <Chip className={className} style={{ width: ' 100px' }}>{value}</Chip>;
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
                const response = await axios.post(VITE_PHIDES_API_URL + '/monitoreo/entrega_turno/cerrarEntrega.php', formData);
                const data = response.data;

                if (data.status === 1) {
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
            <CssBaseline />
            <Main open={open}>
                <Stack spacing={2} direction="row">
                    {dataEntrega.length > 0 && dataEntrega[0].estado !== 'cerrado' && (
                        <Button onClick={handleClickOpen2} color='primary'>Nuevo evento</Button>
                    )}

                    {dataEntrega.length > 0 && dataEntrega[0].estado !== 'cerrado' && (
                        <Button onClick={cerrar_entrega} color='danger'>Cerrar entrega</Button>
                    )}

                </Stack>
                <MaterialReactTable table={table} />
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