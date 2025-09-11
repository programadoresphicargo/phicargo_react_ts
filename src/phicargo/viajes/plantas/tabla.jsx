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
    AutocompleteSection,
    Textarea,
    Link,
    Input
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
import odooApi from "@/api/odoo-api";
import { ViajeContext } from "../context/viajeContext";
import { toast } from "react-toastify";

export default function PlantaViaje({ isOpen, onOpenChange }) {
    const { id_viaje, viaje } = useContext(ViajeContext);
    const [isLoading, setLoading] = useState(false);
    const [isLoading2, setLoading2] = useState(false);
    const [data, setData] = useState([]);

    const [cliente, setCliente] = useState({
        id: viaje?.partner?.id,
        x_url_google_maps: viaje?.direccion_destino?.x_url_google_maps
    });

    const LigarGeocerca = async () => {
        if (!validarFormulario()) return;

        try {
            setLoading(true);
            const response = await odooApi.post('/geocercas_viajes/', cliente);
            if (response.data.status == "success") {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    const validarFormulario = () => {
        let newErrors = {};

        if (!cliente.x_url_google_maps || cliente.x_url_google_maps.trim() === '') {
            newErrors.x_url_google_maps = "El link es obligatorio";
        } else if (!esLinkGoogleMaps(cliente.x_url_google_maps)) {
            newErrors.x_url_google_maps = "Debe ser un link válido de Google Maps";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const esLinkGoogleMaps = (texto) => {
        try {
            const url = new URL(texto);
            return url.hostname === "maps.app.goo.gl" || url.hostname === "www.google.com";
        } catch {
            return false;
        }
    };

    const [errors, setErrors] = useState({});

    const handleContactoChange = (e) => {
        const { name, value } = e.target;
        setCliente((prevCliente) => ({
            ...prevCliente,
            [name]: value,
        }));

        setErrors({
            ...errors,
            [name]: ''
        });
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={onOpenChange}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
                        color: 'white',
                        fontFamily: 'Inter'
                    }}
                >
                    Ubicación de planta
                </DialogTitle>

                <DialogContent dividers>

                    <Box
                        className="mb-2"
                        sx={{
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap',
                        }}
                    >

                        {viaje?.x_modo_bel === 'exp' ? (
                            <div>
                                <span className="font-semibold text-gray-600">Dirección origen:</span>
                                <div>{viaje?.direccion_origen?.id || '—'}</div>
                                <div>{viaje?.direccion_origen?.name || '—'}</div>
                                <div>{viaje?.direccion_origen?.street || '—'}</div>
                            </div>
                        ) : (
                            <div>
                                <span className="font-semibold text-gray-600">Dirección destino:</span>
                                <div>{viaje?.direccion_destino?.id || '—'}</div>
                                <div>{viaje?.direccion_destino?.name || '—'}</div>
                                <div>{viaje?.direccion_destino?.street || '—'}</div>
                            </div>
                        )}
                    </Box>

                    <Textarea
                        name="x_url_google_maps"
                        label="URL Google Maps"
                        variant="flat"
                        value={cliente.x_url_google_maps || ''}
                        onChange={handleContactoChange}
                        isInvalid={!!errors.x_url_google_maps}
                        errorMessage={errors.x_url_google_maps}
                    />

                </DialogContent>
                <DialogActions>
                    <Button
                        isLoading={isLoading}
                        color="primary"
                        onPress={() => LigarGeocerca()}
                        className="text-white">
                        Guardar
                    </Button>
                    <Button
                        color="default"
                        onPress={onOpenChange}
                        className="text-white">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
