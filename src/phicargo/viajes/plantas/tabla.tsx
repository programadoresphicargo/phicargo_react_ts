import { useState, useMemo, useEffect, useContext } from "react";
import {
    Button,
    Textarea,
    Link,
    useDisclosure,
} from "@heroui/react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import odooApi from "@/api/odoo-api";
import { ViajeContext } from "../context/viajeContext";
import { toast } from "react-toastify";

type ClienteEditable = {
    id?: number;
    x_url_google_maps: string;
};

type ErrorsType = {
    x_url_google_maps?: string;
};

export default function PlantaViaje() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { viaje, getViaje } = useContext(ViajeContext);

    const direccion = useMemo(() => {
        if (!viaje) return null;

        return viaje.x_modo_bel === "exp"
            ? viaje.direccion_origen
            : viaje.direccion_destino;
    }, [viaje]);

    const cliente = useMemo(() => {
        return {
            id: direccion?.id,
            x_url_google_maps:
                direccion?.x_url_google_maps || "",
        };
    }, [direccion]);

    const [clienteEditable, setClienteEditable] =
        useState<ClienteEditable>(cliente);

    const [isEditing, setIsEditing] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(false);

    const [errors, setErrors] =
        useState<ErrorsType>({});

    useEffect(() => {
        setClienteEditable(cliente);
        setIsEditing(false);
        setErrors({});
    }, [cliente, isOpen]);

    const esLinkGoogleMaps = (texto: string) => {
        if (!texto) return false;

        const regex =
            /^https?:\/\/(maps\.app\.goo\.gl|www\.google\.com\/maps|google\.com\/maps)/i;

        return regex.test(texto);
    };

    const validarFormulario = (
        c: ClienteEditable
    ): boolean => {
        const newErrors: ErrorsType = {};

        if (
            !c?.x_url_google_maps ||
            c.x_url_google_maps.trim() === ""
        ) {
            newErrors.x_url_google_maps =
                "El enlace es obligatorio";
        } else if (
            !esLinkGoogleMaps(
                c.x_url_google_maps.trim()
            )
        ) {
            newErrors.x_url_google_maps =
                "Debe ser un enlace válido de Google Maps";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setClienteEditable(cliente);
        setIsEditing(false);
        setErrors({});
    };

    const handleClose = () => {
        onOpenChange();
        setIsEditing(false);
        setClienteEditable(cliente);
        setErrors({});
    };

    const handleSubmit = async () => {
        if (!validarFormulario(clienteEditable)) {
            return;
        }

        try {
            setIsLoading(true);

            const response = await odooApi.patch(
                "/contacts/",
                clienteEditable
            );

            if (response.data?.status === "success") {
                toast.success(response.data.message);

                await getViaje(viaje?.id);

                setIsEditing(false);
                onOpenChange();
            } else {
                toast.error(
                    response.data?.message ||
                    "Error al guardar"
                );
            }
        } catch (err) {
            console.error(err);
            toast.error(
                "Ocurrió un error inesperado"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* BOTÓN DE ESTADO */}
            <Button
                radius="md"
                className="text-white"
                color={
                    cliente?.x_url_google_maps
                        ? "success"
                        : "danger"
                }
                size="sm"
                onPress={onOpen}
                startContent={
                    <i
                        className={
                            cliente?.x_url_google_maps
                                ? "bi bi-pin-map-fill"
                                : "bi bi-pin-map"
                        }
                    />
                }
            >
                {cliente?.x_url_google_maps
                    ? "Planta registrada"
                    : "Sin planta registrada"}
            </Button>

            {/* MODAL */}
            <Dialog
                open={isOpen}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        overflow: "hidden",
                        backgroundColor: "#f8fafc",
                    },
                }}
            >
                {/* HEADER */}
                <DialogTitle
                    sx={{
                        backgroundColor: "#ffffff",
                        color: "#1e293b",
                        borderBottom:
                            "1px solid #e2e8f0",
                        padding: "18px 24px",
                        fontFamily: "Inter",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002887] text-white">
                            <i className="bi bi-geo-alt-fill text-lg" />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[17px] font-bold leading-tight text-slate-800">
                                Ubicación de planta
                            </span>

                            <span className="mt-0.5 text-xs font-normal text-slate-500">
                                Consulta y administra la ubicación
                                asociada al viaje.
                            </span>
                        </div>
                    </div>
                </DialogTitle>

                {/* BODY */}
                <DialogContent
                    sx={{
                        backgroundColor: "#f8fafc",
                        padding: "20px",
                        marginTop: "10px"
                    }}
                >
                    <div className="space-y-4">

                        {/* INFORMACIÓN DE LA PLANTA */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#002887]">
                                        <i className="bi bi-building" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Información de la planta
                                        </h3>

                                        <p className="text-xs text-slate-500">
                                            Dirección asociada al origen o destino
                                            del viaje.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                {direccion ? (
                                    <div className="space-y-3">
                                        {/* NOMBRE */}
                                        <div>
                                            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                Planta / Cliente
                                            </span>

                                            <p className="mt-1 text-sm font-semibold text-slate-700">
                                                {direccion.name || "—"}
                                            </p>
                                        </div>

                                        {/* CALLE */}
                                        <div>
                                            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                Dirección
                                            </span>

                                            <p className="mt-1 text-sm text-slate-600">
                                                {direccion.street || "—"}
                                            </p>
                                        </div>

                                        {/* DATOS UBICACIÓN */}
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                    Código postal
                                                </span>

                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                    {viaje?.x_modo_bel === "exp"
                                                        ? direccion?.codigo_postal_origen ||
                                                        "—"
                                                        : direccion?.codigo_postal_destino ||
                                                        "—"}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                    Estado
                                                </span>

                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                    {viaje?.x_modo_bel === "exp"
                                                        ? direccion?.estado_origen ||
                                                        "—"
                                                        : direccion?.estado_destino ||
                                                        "—"}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                    Municipio
                                                </span>

                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                    {viaje?.x_modo_bel === "exp"
                                                        ? direccion?.municipio_origen ||
                                                        "—"
                                                        : direccion?.municipio_destino ||
                                                        "—"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* GOOGLE MAPS */}
                                        {clienteEditable?.x_url_google_maps && (
                                            <div className="border-t border-slate-100 pt-4">
                                                <Button
                                                    radius="md"
                                                    size="sm"
                                                    color="success"
                                                    variant="flat"
                                                    as={Link}
                                                    href={
                                                        clienteEditable.x_url_google_maps
                                                    }
                                                    isExternal
                                                    showAnchorIcon
                                                    startContent={
                                                        <i className="bi bi-map" />
                                                    }
                                                >
                                                    Ver ubicación en Google Maps
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                            <i className="bi bi-geo-alt text-lg" />
                                        </div>

                                        <p className="mt-3 text-sm font-medium text-slate-600">
                                            No hay dirección asociada
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            No se encontró información de
                                            ubicación para este viaje.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CONFIGURACIÓN DEL ENLACE */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                        <i className="bi bi-link-45deg" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Enlace de ubicación
                                        </h3>

                                        <p className="text-xs text-slate-500">
                                            URL utilizada para consultar la
                                            ubicación en Google Maps.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                <Textarea
                                    name="x_url_google_maps"
                                    label="URL de Google Maps"
                                    placeholder="https://maps.google.com/..."
                                    variant="bordered"
                                    minRows={3}
                                    value={
                                        clienteEditable?.x_url_google_maps ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setClienteEditable((prev) => ({
                                            ...prev,
                                            x_url_google_maps:
                                                e.target.value,
                                        }))
                                    }
                                    isInvalid={
                                        !!errors.x_url_google_maps
                                    }
                                    errorMessage={
                                        errors.x_url_google_maps
                                    }
                                    isDisabled={!isEditing}
                                    classNames={{
                                        inputWrapper:
                                            "border-slate-200 shadow-none",
                                    }}
                                />

                                {!isEditing && (
                                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                                        <i className="bi bi-lock-fill" />
                                        Presiona "Editar" para modificar el
                                        enlace.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>

                {/* FOOTER */}
                <DialogActions
                    sx={{
                        backgroundColor: "#ffffff",
                        borderTop:
                            "1px solid #e2e8f0",
                        padding: "12px 20px",
                    }}
                >
                    {isEditing ? (
                        <>
                            <Button
                                color="default"
                                variant="flat"
                                radius="md"
                                size="sm"
                                onPress={handleCancel}
                                isDisabled={isLoading}
                            >
                                Cancelar
                            </Button>

                            <Button
                                color="primary"
                                radius="md"
                                size="sm"
                                onPress={handleSubmit}
                                isLoading={isLoading}
                                startContent={
                                    !isLoading && (
                                        <i className="bi bi-check-lg" />
                                    )
                                }
                            >
                                Guardar cambios
                            </Button>
                        </>
                    ) : (
                        <Button
                            color="primary"
                            variant="flat"
                            radius="md"
                            size="sm"
                            onPress={handleEdit}
                            startContent={
                                <i className="bi bi-pencil" />
                            }
                        >
                            Editar
                        </Button>
                    )}

                    <Button
                        color="default"
                        variant="flat"
                        onPress={handleClose}
                        radius="md"
                        size="sm"
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}