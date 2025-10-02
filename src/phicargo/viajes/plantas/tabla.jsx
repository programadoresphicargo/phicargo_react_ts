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

export default function PlantaViaje() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { viaje, getViaje } = useContext(ViajeContext);

    const cliente = useMemo(() => {
        if (!viaje) return {};
        const direccion = viaje?.x_modo_bel === 'exp'
            ? viaje?.direccion_origen
            : viaje?.direccion_destino;
        return {
            id: direccion?.id,
            x_url_google_maps: direccion?.x_url_google_maps || "",
        };
    }, [viaje]);

    const [errors, setErrors] = useState({});
    const [isLoading, setLoading] = useState(false);

    const validarFormulario = (cliente) => {
        let newErrors = {};
        if (!cliente.x_url_google_maps?.trim()) {
            newErrors.x_url_google_maps = "El link es obligatorio";
        } else if (!esLinkGoogleMaps(cliente.x_url_google_maps)) {
            newErrors.x_url_google_maps = "Debe ser un link válido de Google Maps";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const esLinkGoogleMaps = (texto) =>
        /^https?:\/\/(maps\.app\.goo\.gl|www\.google\.com\/maps)/.test(texto);

    const handleSubmit = async () => {
        if (!validarFormulario(cliente)) return;
        try {
            setLoading(true);
            const { data } = await odooApi.patch('/contacts/', cliente);
            if (data.status === "success") {
                toast.success(data.message);
                getViaje(viaje?.id);
                onOpenChange();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setLoading(false);
        }
    };

    const direccion = viaje?.x_modo_bel === 'exp'
        ? viaje?.direccion_origen
        : viaje?.direccion_destino;

    return (
        <>
            <Button
                radius="full"
                color={cliente?.x_url_google_maps ? "success" : "danger"}
                className="text-white"
                onPress={onOpen}
            >
                <i className="bi bi-pin-map"></i>
                {cliente?.x_url_google_maps ? "Planta registrada" : "Sin planta registrada"}
            </Button>

            <Dialog open={isOpen} onClose={onOpenChange} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)', color: 'white' }}>
                    Ubicación de planta
                </DialogTitle>

                <DialogContent dividers>
                    <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {direccion && (
                            <div>
                                <span className="font-semibold text-gray-600">Dirección:</span>
                                <div>{direccion.name || '—'}</div>
                                <div>{direccion.street || '—'}</div>
                            </div>
                        )}
                        {cliente.x_url_google_maps && (
                            <Button as={Link} href={cliente.x_url_google_maps} target="_blank" color="success" className="text-white" radius="full">
                                Ver en Google Maps
                            </Button>
                        )}
                    </Box>

                    <Textarea
                        name="x_url_google_maps"
                        label="URL Google Maps"
                        value={cliente.x_url_google_maps}
                        onChange={(e) => cliente.x_url_google_maps = e.target.value}
                        isInvalid={!!errors.x_url_google_maps}
                        errorMessage={errors.x_url_google_maps}
                    />
                </DialogContent>

                <DialogActions>
                    <Button isLoading={isLoading} color="primary" onPress={handleSubmit} className="text-white" radius="full">
                        Guardar
                    </Button>
                    <Button color="default" onPress={onOpenChange} className="text-white" radius="full">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
