import React, { useState, useMemo, useEffect, useContext } from "react";
import {
    Button,
    Textarea,
    Link,
    useDisclosure,
} from "@heroui/react";
import { Box } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import odooApi from "@/api/odoo-api";
import { ViajeContext } from "../context/viajeContext";
import { toast } from "react-toastify";

export default function PlantaViaje() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { viaje, getViaje } = useContext(ViajeContext);

    const direccion = useMemo(() => {
        if (!viaje) return null;
        return viaje?.x_modo_bel === "exp" ? viaje?.direccion_origen : viaje?.direccion_destino;
    }, [viaje]);

    // cliente derivado desde `direccion`
    const cliente = useMemo(() => {
        return {
            id: direccion?.id,
            x_url_google_maps: direccion?.x_url_google_maps || "",
        };
    }, [direccion]);

    // estados locales para edición
    const [clienteEditable, setClienteEditable] = useState(cliente);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // cuando cambia la `cliente` o se abre/cierra el modal, sincronizamos
    useEffect(() => {
        setClienteEditable(cliente);
        setIsEditing(false);
        setErrors({});
    }, [cliente, isOpen]);

    const esLinkGoogleMaps = (texto) => {
        if (!texto) return false;
        // permitimos maps.app.goo.gl y variantes de google maps
        const regex = /^https?:\/\/(maps\.app\.goo\.gl|www\.google\.com\/maps|google\.com\/maps)/i;
        return regex.test(texto);
    };

    const validarFormulario = (c) => {
        const newErrors = {};
        if (!c?.x_url_google_maps || c.x_url_google_maps.trim() === "") {
            newErrors.x_url_google_maps = "El link es obligatorio";
        } else if (!esLinkGoogleMaps(c.x_url_google_maps.trim())) {
            newErrors.x_url_google_maps = "Debe ser un link válido de Google Maps";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        setClienteEditable(cliente);
        setIsEditing(false);
        setErrors({});
    };

    const handleSubmit = async () => {
        if (!validarFormulario(clienteEditable)) return;
        try {
            setIsLoading(true);
            const response = await odooApi.patch("/contacts/", clienteEditable);
            if (response.data?.status === "success") {
                toast.success(response.data.message);
                await getViaje(viaje?.id);
                setIsEditing(false);
                onOpenChange(); // cerramos el modal tras guardar (igual puedes quitar esto si prefieres quedarse abierto)
            } else {
                toast.error(response.data?.message || "Error al guardar");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                radius="full"
                className="text-white"
                color={cliente?.x_url_google_maps ? "success" : "danger"}
                onPress={onOpen}
            >
                <i className="bi bi-pin-map" />
                {cliente?.x_url_google_maps ? "Planta registrada" : "Sin planta registrada"}
            </Button>

            <Dialog
                open={isOpen}
                onClose={() => {
                    onOpenChange();
                    setIsEditing(false);
                    setClienteEditable(cliente);
                    setErrors({});
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        background: "linear-gradient(90deg, #002887 0%, #0059b3 100%)",
                        color: "white",
                        fontFamily: "Inter",
                    }}
                >
                    Ubicación de planta
                </DialogTitle>

                <DialogContent dividers>
                    <Box
                        className="mb-2"
                        sx={{
                            display: "flex",
                            gap: "16px",
                            flexWrap: "wrap",
                        }}
                    >
                        {direccion ? (
                            <div>
                                <span className="font-semibold text-gray-600">Dirección:</span>
                                <div>{direccion.name || "—"}</div>
                                <div>{direccion.street || "—"}</div>
                            </div>
                        ) : (
                            <div>No hay dirección asociada.</div>
                        )}

                        {clienteEditable?.x_url_google_maps && (
                            <Button
                                radius="full"
                                isExternal
                                color="success"
                                className="text-white"
                                as={Link}
                                href={clienteEditable.x_url_google_maps}
                                showAnchorIcon
                            >
                                Ver en Google Maps
                            </Button>
                        )}
                    </Box>

                    <Textarea
                        name="x_url_google_maps"
                        label="URL Google Maps"
                        variant="flat"
                        value={clienteEditable?.x_url_google_maps || ""}
                        onChange={(e) =>
                            setClienteEditable((prev) => ({ ...prev, x_url_google_maps: e.target.value }))
                        }
                        isInvalid={!!errors.x_url_google_maps}
                        errorMessage={errors.x_url_google_maps}
                        disabled={!isEditing}
                    />
                </DialogContent>

                <DialogActions>
                    {isEditing ? (
                        <>
                            <Button isLoading={isLoading} color="primary" onPress={handleSubmit} className="text-white" radius="full">
                                Guardar
                            </Button>
                            <Button color="default" onPress={handleCancel} className="text-white" radius="full">
                                Cancelar
                            </Button>
                        </>
                    ) : (
                        <Button color="warning" onPress={handleEdit} className="text-white" radius="full">
                            Editar
                        </Button>
                    )}

                    <Button
                        color="default"
                        onPress={() => {
                            onOpenChange();
                            setIsEditing(false);
                            setClienteEditable(cliente);
                        }}
                        className="text-white"
                        radius="full"
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
