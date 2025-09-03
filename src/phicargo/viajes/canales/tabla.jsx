import React, { useState, useMemo, useEffect, useContext } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Divider,
    useDisclosure,
    Chip,
    Card,
    CardBody,
    CardHeader,
    Autocomplete,
    AutocompleteItem,
    AutocompleteSection
}
    from "@heroui/react";
import Stack from '@mui/material/Stack';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Box } from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import RegistrarContactoDialog from "./form";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import odooApi from "@/api/odoo-api";
import { ViajeContext } from "../context/viajeContext";
import { toast } from "react-toastify";

export default function WhatsAppContatcsTravel({ isOpen, onOpenChange }) {
    const { id_viaje } = useContext(ViajeContext);

    const {
        isOpen: isOpen11,
        onOpen: onOpen11,
        onOpenChange: onOpenChange11,
    } = useDisclosure();

    const [isLoading, setLoading] = useState(false);
    const [isLoading2, setLoading2] = useState(false);

    const [whatsappItems, setWhatsappItems] = useState([]);
    const [correoItems, setEmailsItems] = useState([]);

    const [canalesSeleccionados, setCanalesSeleccionados] = useState([]);

    const GuardarCanales = async () => {
        try {
            setLoading(true);
            const response = await odooApi.post('/canales_viajes/', canalesSeleccionados);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    const fetchCanalesLigados = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/canales_viajes/id_viaje/' + id_viaje);
            setCanalesSeleccionados(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCanalesLigados();
        fetchCanalesDisponibles();
    }, [isOpen, isOpen11]);

    const fetchCanalesDisponibles = async () => {
        try {
            setLoading2(true);
            const response = await odooApi.get('/canales_contactos/id_cliente/1');
            setWhatsappItems(response.data.filter(c => c.tipo === 'whatsapp'));
            setEmailsItems(response.data.filter(c => c.tipo === 'correo'));
            setLoading2(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading2(false);
        }
    };

    const eliminarCanal = (id) => {
        setCanalesSeleccionados(prev =>
            prev.filter(canal => canal.id_canal !== id)
        );
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'tipo', header: 'Tipo', Cell: ({ row }) => {
                    const valor = row.original.tipo;
                    return (
                        <Chip
                            color={valor === "correo" ? "primary" : "success"}
                            className="text-white"
                            size="lg"
                            startContent={
                                <i className={`bi ${valor === "correo" ? "bi-envelope" : "bi-whatsapp"}`}></i>
                            }
                        >
                            {valor}
                        </Chip>
                    );
                },
            },
            { accessorKey: 'valor', header: 'Valor' },
            {
                accessorKey: 'desligar', header: 'Desligar', Cell: ({ row }) => {
                    const valor = row.original.tipo;
                    return (
                        <Button
                            color="danger"
                            size="sm"
                            radius="full"
                            onPress={() => eliminarCanal(row.original.id_canal)}
                        >
                            <i class="bi bi-x-circle"></i>
                        </Button>
                    );
                },
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: canalesSeleccionados,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        localization: MRT_Localization_ES,
        state: {
            showProgressBars: isLoading,
        },
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            pagination: { pageSize: 80 },
            showColumnFilters: true,
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
                onOpen();
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
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
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
                maxHeight: 'calc(100vh - 260px)',
            },
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >

                <Button color="danger"
                    onPress={() => {
                        fetchCanalesLigados();
                    }}>
                    <i class="bi bi-arrow-clockwise"></i>
                    Refrescar
                </Button>

            </Box >
        ),
    });

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={onOpenChange}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle
                    className="bg-primary"
                    sx={{
                        color: 'white',
                    }}
                >
                    Destinatarios
                </DialogTitle>

                <DialogContent dividers>
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader className='bg-success'>
                                <div className="flex flex-col">
                                    <p className="text-md font-bold text-white">Canales disponibles</p>
                                </div>
                            </CardHeader>
                            <CardBody>

                                <Box
                                    className="mb-2"
                                    sx={{
                                        display: 'flex',
                                        gap: '16px',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <Button color="primary"
                                        onPress={() => {
                                            onOpen11();
                                        }}>
                                        <i class="bi bi-plus-circle"></i>
                                        Nuevo canal
                                    </Button>

                                </Box>
                                <Autocomplete
                                    label="Canales disponibles"
                                    variant="bordered"
                                >
                                    <AutocompleteSection
                                        title="WhatsApp"
                                    >
                                        {whatsappItems.map(canal => (
                                            <AutocompleteItem
                                                onPress={() => {
                                                    if (canalesSeleccionados.some(c => c.id_canal === canal.id_canal)) {
                                                        toast.error('Este canal ya ha sido agregado.');
                                                    } else {
                                                        setCanalesSeleccionados(prev => [...prev, { ...canal, id_viaje: id_viaje }]);
                                                    }
                                                }}
                                                key={canal.id_canal}
                                                startContent={
                                                    <i className="bi bi-whatsapp" style={{ color: '#25D366' }}></i>
                                                }
                                            >
                                                <strong style={{ color: '#25D366' }}>{canal.nombre}</strong> - <span style={{ color: '#25D366' }}>{canal.valor}</span>
                                            </AutocompleteItem>
                                        ))}
                                    </AutocompleteSection>

                                    <AutocompleteSection
                                        title="Email"
                                    >
                                        {correoItems.map(canal => (
                                            <AutocompleteItem
                                                onPress={() => {
                                                    if (canalesSeleccionados.some(c => c.id_canal === canal.id_canal)) {
                                                        toast.error('Este canal ya ha sido agregado.');
                                                    } else {
                                                        setCanalesSeleccionados(prev => [...prev, { ...canal, id_viaje: id_viaje }]);
                                                    }
                                                }}
                                                key={canal.id_canal}
                                                startContent={
                                                    <i className="bi bi-envelope" style={{ color: '#0d6efd' }}></i>
                                                }
                                            >
                                                <strong style={{ color: '#0d6efd' }}>{canal.nombre}</strong> - <span style={{ color: '#0d6efd' }}>{canal.valor}</span>
                                            </AutocompleteItem>
                                        ))}
                                    </AutocompleteSection>
                                </Autocomplete>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader className='bg-primary'>
                                <div className="flex flex-col">
                                    <p className="text-md font-bold text-white">Canales de difusión ligados a viaje</p>
                                </div>
                            </CardHeader>
                            <Divider></Divider>
                            <CardBody>
                                <MaterialReactTable table={table} />
                            </CardBody>
                        </Card>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onPress={() => GuardarCanales()} className="text-white">
                        Guardar
                    </Button>
                    <Button color="default" onPress={onOpenChange} className="text-white">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            <RegistrarContactoDialog open={isOpen11} onClose={onOpenChange11}></RegistrarContactoDialog>
        </>
    );
}
